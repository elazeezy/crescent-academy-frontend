import mongoose, { Schema, Document } from 'mongoose';

// A student's request to retake a CBT they already submitted — typically because a
// system/network fault recorded a wrong (often zero) score. A teacher (the exam's
// creator) or an admin approves or rejects it. Approval flips the attempt's
// `reattemptAllowed`, which lets the student start a fresh attempt whose new submission
// overrides the previous grade.
export interface IReattemptRequest extends Document {
  exam: mongoose.Types.ObjectId;
  student: mongoose.Types.ObjectId;
  teacher: mongoose.Types.ObjectId;   // exam.createdBy — who should decide
  examTitle: string;                  // denormalised for easy listing
  studentName: string;                // denormalised for easy listing
  reason?: string;
  status: 'pending' | 'approved' | 'rejected';
  decidedBy?: mongoose.Types.ObjectId;
  decidedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ReattemptRequestSchema = new Schema<IReattemptRequest>(
  {
    exam:        { type: Schema.Types.ObjectId, ref: 'Exam', required: true },
    student:     { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    teacher:     { type: Schema.Types.ObjectId, ref: 'User', required: true },
    examTitle:   { type: String, required: true },
    studentName: { type: String, required: true },
    reason:      { type: String },
    status:      { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    decidedBy:   { type: Schema.Types.ObjectId, ref: 'User' },
    decidedAt:   { type: Date },
  },
  { timestamps: true }
);

// Teacher inbox: pending requests for my exams, newest first.
ReattemptRequestSchema.index({ teacher: 1, status: 1, createdAt: -1 });
// Fast per-student-per-exam lookups (status badge on the exam list).
ReattemptRequestSchema.index({ student: 1, exam: 1, createdAt: -1 });

export default mongoose.models.ReattemptRequest ||
  mongoose.model<IReattemptRequest>('ReattemptRequest', ReattemptRequestSchema);
