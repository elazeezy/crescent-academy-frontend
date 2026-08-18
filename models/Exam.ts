import mongoose, { Schema, Document } from 'mongoose';

export interface IExamQuestion {
  text: string;
  options: string[];
  correctIndex: number;
}

export interface IExam extends Document {
  title: string;
  subject: string;
  section: 'college' | 'science';
  targetClass: string;
  objectiveCount: number;
  durationMinutes: number;
  theoryMaxScore: number;
  questions: IExamQuestion[];
  status: 'draft' | 'pending_review' | 'rejected' | 'live' | 'closed';
  windowStart?: Date;
  windowEnd?: Date;
  createdBy: mongoose.Types.ObjectId;
  approvedBy?: mongoose.Types.ObjectId;
  approvedAt?: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ExamQuestionSchema = new Schema<IExamQuestion>(
  {
    text:         { type: String, required: true },
    options:      { type: [String], required: true, validate: (v: string[]) => v.length >= 2 && v.length <= 6 },
    correctIndex: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const ExamSchema = new Schema<IExam>(
  {
    title:           { type: String, required: true },
    subject:         { type: String, required: true },
    section:         { type: String, enum: ['college', 'science'], required: true },
    targetClass:     { type: String, required: true },
    // 3/5/10 are demo-only counts used by the admin CBT Testing sandbox
    objectiveCount:  { type: Number, required: true, enum: [3, 5, 10, 30, 60, 100] },
    durationMinutes: { type: Number, required: true, min: 1 },
    theoryMaxScore:  { type: Number, required: true, default: 40, min: 0, max: 100 },
    questions:       { type: [ExamQuestionSchema], default: [] },
    status:          { type: String, enum: ['draft', 'pending_review', 'rejected', 'live', 'closed'], default: 'draft' },
    windowStart:     { type: Date },
    windowEnd:       { type: Date },
    createdBy:       { type: Schema.Types.ObjectId, ref: 'User', required: true },
    approvedBy:      { type: Schema.Types.ObjectId, ref: 'User' },
    approvedAt:      { type: Date },
    rejectionReason: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.models.Exam || mongoose.model<IExam>('Exam', ExamSchema);
