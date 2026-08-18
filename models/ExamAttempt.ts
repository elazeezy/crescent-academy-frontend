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
  },
  { timestamps: true }
);

// One attempt per student per exam
ExamAttemptSchema.index({ exam: 1, student: 1 }, { unique: true });

export default mongoose.models.ExamAttempt || mongoose.model<IExamAttempt>('ExamAttempt', ExamAttemptSchema);
