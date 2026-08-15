import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITeacher extends Document {
  user: mongoose.Types.ObjectId;
  section: 'college' | 'science';
  assignedClass: string;
  subjects: string[];
}

const TeacherSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  section: { type: String, enum: ['college', 'science'], required: true, default: 'college' },
  assignedClass: { type: String, required: true },
  subjects: [{ type: String }]
});

export default mongoose.models.Teacher || mongoose.model<ITeacher>("Teacher", TeacherSchema);