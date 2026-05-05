import mongoose, { Schema, Document } from 'mongoose';

export interface ISubjectResult {
  subjectName: string;
  test1: number;
  test2: number;
  test3: number;
  examScore: number;
  total: number;
  grade: string;
}

export interface IAttendance {
  daysOpened: number;
  daysPresent: number;
  daysAbsent: number;
}

export interface IResult extends Document {
  student: mongoose.Types.ObjectId;
  term: string;
  session: string;
  subjects: ISubjectResult[];
  affectiveTraits: Record<string, number>;
  psychomotorSkills: Record<string, number>;
  attendance: IAttendance;
  nextTermBegins: string;
  termEnded: string;
  teacherComment: string;
  formMasterComment: string;
  principalComment?: string;
  formMasterSignature?: string;
  principalSignature?: string;
  schoolStamp?: string;
  gpa: number;
  published: boolean;
  publishedAt?: Date;
}

const SubjectResultSchema = new Schema({
  subjectName: { type: String, required: true },
  test1:      { type: Number, default: 0, min: 0, max: 10 },
  test2:      { type: Number, default: 0, min: 0, max: 10 },
  test3:      { type: Number, default: 0, min: 0, max: 10 },
  examScore:  { type: Number, default: 0, min: 0, max: 70 },
  total:      { type: Number, required: true, min: 0, max: 100 },
  grade:      { type: String, required: true },
}, { _id: false });

const AttendanceSchema = new Schema({
  daysOpened:  { type: Number, default: 0 },
  daysPresent: { type: Number, default: 0 },
  daysAbsent:  { type: Number, default: 0 },
}, { _id: false });

const ResultSchema = new Schema<IResult>(
  {
    student:  { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    term:     { type: String, required: true },
    session:  { type: String, required: true },
    subjects: [SubjectResultSchema],

    // Ratings 1–5 for each trait/skill key
    affectiveTraits:  { type: Schema.Types.Mixed, default: {} },
    psychomotorSkills: { type: Schema.Types.Mixed, default: {} },

    attendance:      { type: AttendanceSchema, default: () => ({}) },
    nextTermBegins:  { type: String, default: '' },

    teacherComment:     { type: String, default: '' },
    formMasterComment:  { type: String, default: '' },
    principalComment:   { type: String, default: '' },

    formMasterSignature: { type: String, default: '' },
    principalSignature:  { type: String, default: '' },
    schoolStamp:         { type: String, default: '' },

    termEnded:    { type: String, default: '' },
    published:    { type: Boolean, default: false },
    publishedAt:  { type: Date },

    gpa: { type: Number, required: true },
  },
  { timestamps: true }
);

// Compound index so one result per student per term per session
ResultSchema.index({ student: 1, term: 1, session: 1 }, { unique: true });

export default mongoose.models.Result ||
  mongoose.model<IResult>('Result', ResultSchema);
