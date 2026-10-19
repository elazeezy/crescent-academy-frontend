import mongoose, { Schema, Document } from 'mongoose';

export interface IDisconnectEntry {
  gapSeconds: number;
  creditedSeconds: number;
  at: Date;
}

export interface IExamAttempt extends Document {
  exam: mongoose.Types.ObjectId;
  student: mongoose.Types.ObjectId;
  answers: (number | null)[];
  startedAt: Date;
  deadline: Date;
  lastSeenAt: Date;
  disconnectLog: IDisconnectEntry[];
  status: 'in_progress' | 'submitted' | 'auto_submitted';
  objectiveScore?: number;
  correctCount?: number;
  submittedAt?: Date;
  // Re-attempt: granted by a teacher/admin. When true, the next `start` resets
  // the attempt to a fresh in-progress run. attemptNumber tracks how many times
  // the student has started this exam (1 for the first run).
  reattemptAllowed: boolean;
  attemptNumber: number;
}

const DisconnectEntrySchema = new Schema<IDisconnectEntry>(
  {
    gapSeconds:      { type: Number, required: true },
    creditedSeconds: { type: Number, required: true },
    at:              { type: Date, default: Date.now },
  },
  { _id: false }
);

const ExamAttemptSchema = new Schema<IExamAttempt>(
  {
    exam:       { type: Schema.Types.ObjectId, ref: 'Exam', required: true },
    student:    { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    answers:    { type: [Number], default: [] },
    startedAt:  { type: Date, required: true },
    deadline:   { type: Date, required: true },
    lastSeenAt: { type: Date, default: Date.now },
    disconnectLog: { type: [DisconnectEntrySchema], default: [] },
    status:     { type: String, enum: ['in_progress', 'submitted', 'auto_submitted'], default: 'in_progress' },
    objectiveScore: { type: Number },
    correctCount:   { type: Number },
    submittedAt:    { type: Date },
    reattemptAllowed: { type: Boolean, default: false },
    attemptNumber:    { type: Number, default: 1 },
  },
  { timestamps: true }
);

// One attempt per student per exam. This compound index also serves queries that
// filter by `exam` alone (leftmost-prefix), e.g. the monitor/grade views.
ExamAttemptSchema.index({ exam: 1, student: 1 }, { unique: true });
// Serves the student's own exam list (find({ student })), which the compound index
// above cannot (student is not a prefix).
ExamAttemptSchema.index({ student: 1 });

export default mongoose.models.ExamAttempt || mongoose.model<IExamAttempt>('ExamAttempt', ExamAttemptSchema);
