import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import Exam from '@/models/Exam';
import ExamAttempt from '@/models/ExamAttempt';
import Student from '@/models/Student';
import Result from '@/models/Result';
import { calculateGrade, scaleObjectiveScore } from '@/lib/grading';

// POST /api/student/exams/[id]/submit — grades server-side, never reveals the score to the student
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'student') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  await dbConnect();

  const student = await Student.findOne({ user: session.user.id }).lean() as any;
  if (!student) return NextResponse.json({ error: 'Student profile not found' }, { status: 404 });

  const attempt = await ExamAttempt.findOne({ exam: id, student: student._id });
  if (!attempt) return NextResponse.json({ error: 'Attempt not found' }, { status: 404 });

  const exam = await Exam.findById(id).lean() as any;
  if (!exam) return NextResponse.json({ error: 'Exam not found' }, { status: 404 });

  let correctCount = 0;
  for (let i = 0; i < exam.questions.length; i++) {
    if (attempt.answers[i] === exam.questions[i].correctIndex) correctCount++;
  }

  attempt.correctCount = correctCount;
  const questionCount = exam.questions.length;
  attempt.objectiveScore = scaleObjectiveScore(correctCount, questionCount);
  attempt.status = 'submitted';
  attempt.submittedAt = new Date();
  await attempt.save();

  // CBT Testing is a network/practice run and never writes into academic results.
  if (exam.assessmentSlot !== 'testing') {
    const resultTerm = exam.term || '1st Term';
    const resultSession = exam.session || '2026/2027';
    const result = await Result.findOne({ student: student._id, term: resultTerm, session: resultSession });
    const subjects = (result?.subjects ?? []).map((s: any) => s.toObject ? s.toObject() : { ...s });
    const index = subjects.findIndex((s: any) => s.subjectName === exam.subject);
    const row = index >= 0 ? subjects[index] : {
      subjectName: exam.subject, test1: 0, test2: 0, test3: 0, examScore: 0, total: 0, grade: '-',
    };
    const slot = exam.assessmentSlot;
    const scaled = slot === 'ca1' || slot === 'ca2'
      ? (questionCount ? Math.round((correctCount / questionCount) * 10 * 100) / 100 : 0)
      : attempt.objectiveScore;
    if (slot === 'ca1') row.test1 = scaled;
    else if (slot === 'ca2') row.test2 = scaled;
    else {
      row.isCbt = true;
      row.cbtExamId = exam._id;
      row.objectiveScore = attempt.objectiveScore;
      row.theoryScore = row.theoryScore ?? 0;
      row.examScore = Math.min(70, Number(row.objectiveScore || 0) + Number(row.theoryScore || 0));
    }
    const test1 = Number(row.test1 || 0), test2 = Number(row.test2 || 0), test3 = Number(row.test3 || 0);
    const examMark = Number(row.examScore || 0);
    row.total = test1 + test2 + test3 + examMark;
    row.grade = calculateGrade(row.total);
    if (index >= 0) subjects[index] = row;
    else subjects.push(row);
    const gpa = subjects.length ? subjects.reduce((n: number, s: any) => n + Number(s.total || 0), 0) / subjects.length : 0;
    await Result.findOneAndUpdate(
      { student: student._id, term: resultTerm, session: resultSession },
      { $set: { student: student._id, term: resultTerm, session: resultSession, subjects, gpa } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  return NextResponse.json({ message: 'Submitted successfully. Your score has been recorded.' });
}
