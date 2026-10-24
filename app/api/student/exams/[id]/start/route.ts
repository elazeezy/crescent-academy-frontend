import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import Exam from '@/models/Exam';
import ExamAttempt from '@/models/ExamAttempt';
import Student from '@/models/Student';
import { creditDisconnectGap } from '@/lib/examTiming';
import {
  buildAttemptShuffle, identityShuffle, isValidShuffle,
  toDisplayQuestions, canonicalAnswersToDisplay,
} from '@/lib/examShuffle';

// POST /api/student/exams/[id]/start — begins (or resumes) an attempt.
// Timer is server-stamped; questions are returned WITHOUT correctIndex.
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'student') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    await dbConnect();

    const student = await Student.findOne({ user: session.user.id }).lean() as any;
    if (!student) return NextResponse.json({ error: 'Student profile not found' }, { status: 404 });

    const exam = await Exam.findById(id).lean() as any;
    if (!exam) return NextResponse.json({ error: 'Exam not found' }, { status: 404 });

    if (exam.section !== student.section || exam.targetClass !== student.currentClass) {
      return NextResponse.json({ error: 'This exam is not available for your class' }, { status: 403 });
    }

    const now = new Date();
    let attempt = await ExamAttempt.findOne({ exam: id, student: student._id });

    // A teacher/admin-granted re-attempt bypasses the status/window gates: the student
    // is being asked to retake a submission on purpose, even after the due date.
    const hasGrantedReattempt = !!(attempt && attempt.reattemptAllowed);

    if (!hasGrantedReattempt) {
      if (exam.status !== 'live') {
        return NextResponse.json({ error: 'This exam is not currently open' }, { status: 403 });
      }
      if (exam.windowStart && now < new Date(exam.windowStart)) {
        return NextResponse.json({ error: 'This exam has not opened yet' }, { status: 403 });
      }
      if (exam.windowEnd && now > new Date(exam.windowEnd)) {
        return NextResponse.json({ error: 'This exam window has closed' }, { status: 403 });
      }
    }

    const alreadySubmitted = attempt && (attempt.status === 'submitted' || attempt.status === 'auto_submitted');

    if (alreadySubmitted && attempt.reattemptAllowed) {
      // Teacher/admin granted a re-attempt — reset to a fresh in-progress run.
      const startedAt = now;
      const deadline = new Date(startedAt.getTime() + exam.durationMinutes * 60 * 1000);
      attempt.answers = new Array(exam.questions.length).fill(null);
      attempt.startedAt = startedAt;
      attempt.deadline = deadline;
      attempt.lastSeenAt = now;
      attempt.disconnectLog = [];
      attempt.status = 'in_progress';
      attempt.objectiveScore = undefined;
      attempt.correctCount = undefined;
      attempt.submittedAt = undefined;
      attempt.reattemptAllowed = false;
      attempt.attemptNumber = (attempt.attemptNumber ?? 1) + 1;
      // Fresh re-attempt gets a brand-new shuffle.
      const reshuffle = buildAttemptShuffle(exam.questions);
      attempt.questionOrder = reshuffle.questionOrder;
      attempt.optionOrders = reshuffle.optionOrders;
      await attempt.save();
    } else if (alreadySubmitted) {
      return NextResponse.json({ error: 'You have already submitted this exam' }, { status: 403 });
    }

    if (!attempt) {
      const startedAt = now;
      const deadline = new Date(startedAt.getTime() + exam.durationMinutes * 60 * 1000);
      const shuffle = buildAttemptShuffle(exam.questions);
      attempt = await ExamAttempt.create({
        exam: id,
        student: student._id,
        answers: new Array(exam.questions.length).fill(null),
        startedAt,
        deadline,
        lastSeenAt: now,
        status: 'in_progress',
        questionOrder: shuffle.questionOrder,
        optionOrders: shuffle.optionOrders,
      });
    } else {
      // Resuming — first credit any disconnect gap (capped per attempt) so a student who
      // was simply offline isn't wrongly auto-submitted the instant they return. This is
      // the same crediting the heartbeat applies during a live session.
      const gapSeconds = (now.getTime() - attempt.lastSeenAt.getTime()) / 1000;
      const alreadyCredited = attempt.disconnectLog.reduce((s: number, d: any) => s + d.creditedSeconds, 0);
      const { creditedSeconds, newDeadline } = creditDisconnectGap(gapSeconds, attempt.deadline, alreadyCredited);
      if (creditedSeconds > 0) {
        attempt.disconnectLog.push({ gapSeconds: Math.round(gapSeconds), creditedSeconds, at: now });
        attempt.deadline = newDeadline;
      }

      // Auto-submit only if time is genuinely up even after crediting the disconnect.
      if (now > attempt.deadline) {
        attempt.status = 'auto_submitted';
        await attempt.save();
        return NextResponse.json({ error: 'Time expired while you were disconnected. Your exam was auto-submitted.' }, { status: 403 });
      }
      attempt.lastSeenAt = now;
      await attempt.save();
    }

    // Resolve this attempt's shuffle. Attempts created before shuffling existed get a
    // stable identity order (persisted) so they are never reshuffled mid-exam.
    let shuffle = { questionOrder: attempt.questionOrder, optionOrders: attempt.optionOrders };
    if (!isValidShuffle(shuffle, exam.questions)) {
      shuffle = identityShuffle(exam.questions);
      attempt.questionOrder = shuffle.questionOrder;
      attempt.optionOrders = shuffle.optionOrders;
      await attempt.save();
    }

    // Serve questions and the student's current answers in THIS attempt's display order.
    const questionsForStudent = toDisplayQuestions(exam.questions, shuffle);
    const answersForStudent = canonicalAnswersToDisplay(attempt.answers, shuffle);

    return NextResponse.json({
      attemptId: attempt._id.toString(),
      title: exam.title,
      subject: exam.subject,
      questions: questionsForStudent,
      answers: answersForStudent,
      deadline: attempt.deadline,
      serverNow: now,
    });
  } catch {
    // Shared-cluster overload / transient DB error during a start burst. The client
    // retries with backoff, which also staggers a simultaneous-start stampede.
    return NextResponse.json({ error: 'Server busy, please wait a moment and it will retry automatically.' }, { status: 503 });
  }
}
