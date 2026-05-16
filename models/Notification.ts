import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  title: string;
  message: string;
  sentBy: mongoose.Types.ObjectId;    // Admin user id
  targetRole: 'teacher' | 'all';
  readBy: mongoose.Types.ObjectId[];  // Array of user ids who have read it
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    title:      { type: String, required: true },
    message:    { type: String, required: true },
    sentBy:     { type: Schema.Types.ObjectId, ref: 'User', required: true },
    targetRole: { type: String, enum: ['teacher', 'all'], default: 'teacher' },
    readBy:     [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

export default mongoose.models.Notification ||
  mongoose.model<INotification>('Notification', NotificationSchema);
