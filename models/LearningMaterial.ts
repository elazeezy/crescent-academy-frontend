import mongoose, { Schema, Document } from 'mongoose';

export interface ILearningMaterial extends Document {
  title: string;
  description?: string;
  subject: string;
  targetClass: string;   // e.g. "J.S.S. 1" or "All Classes"
  fileUrl: string;       // Cloudinary URL
  fileType: string;      // pdf, doc, image, etc.
  fileName: string;      // original filename
  uploadedBy: mongoose.Types.ObjectId; // Teacher user id
  createdAt: Date;
  updatedAt: Date;
}

const LearningMaterialSchema = new Schema<ILearningMaterial>(
  {
    title:       { type: String, required: true },
    description: { type: String, default: '' },
    subject:     { type: String, required: true },
    targetClass: { type: String, required: true },
    fileUrl:     { type: String, required: true },
    fileType:    { type: String, required: true },
    fileName:    { type: String, required: true },
    uploadedBy:  { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export default mongoose.models.LearningMaterial ||
  mongoose.model<ILearningMaterial>('LearningMaterial', LearningMaterialSchema);
