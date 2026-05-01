import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Links to credentials [cite: 79, 107]
  studentId: { type: String, required: true, unique: true }, // e.g. STU-2025-0001 
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  gender: { type: String, enum: ['male', 'female'], required: true }, // [cite: 79]
  currentClass: { type: String, required: true }, // Grade 10A, JSS1, etc. [cite: 79]
  parentPhone: { type: String, required: true }, // For SMS/Notifications [cite: 79]
  address: { type: String },
  admissionDate: { type: Date, default: Date.now },
  dateOfBirth:   { type: Date },
  weight:        { type: String },  // e.g. "45kg"
  height:        { type: String },  // e.g. "152cm"
  photo:         { type: String },  // URL to student photo
}, { timestamps: true });

export default mongoose.models.Student || mongoose.model("Student", StudentSchema);