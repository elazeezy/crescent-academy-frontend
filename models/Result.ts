import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IResult extends Document {
  student: mongoose.Types.ObjectId;
  term: string;
  session: string;
  subjects: Array<{
    subjectName: string;
    caScore: number;
    examScore: number;
    total: number;
    grade: string;
  }>;
  teacherComment: string;
  principalComment?: string;
  gpa: number;
}

const ResultSchema = new Schema({
  student: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  term: { type: String, required: true },
  session: { type: String, required: true },
 subjects: [{
  subjectName: String,
  test1: { type: Number, default: 0 },
  test2: { type: Number, default: 0 },
  test3: { type: Number, default: 0 },
  examScore: { type: Number, default: 0 },
  total: { type: Number, required: true },
  grade: String
}],
  teacherComment: { type: String, required: true },
  principalComment: { type: String },
  gpa: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.models.Result || mongoose.model<IResult>("Result", ResultSchema);