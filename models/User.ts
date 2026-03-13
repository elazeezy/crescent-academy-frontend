// models/User.ts
import mongoose, { Schema, Document, Model, CallbackError } from 'mongoose';
import bcrypt from 'bcryptjs';

// Interface for the User document
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'teacher' | 'admin' | 'principal';
  createdAt: Date;
}

// Schema definition
const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['student', 'teacher', 'admin', 'principal'],
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});


// Password hashing middleware - Fixed for TS errors shown in image_324783.png
userSchema.pre('save', async function() {
    // In Mongoose async hooks, you don't need 'next'
    // 'this' refers to the document being saved
    if (!this.isModified('password')) {
        return;
    }

    try {
        const salt = await bcrypt.genSalt(10);
        // We cast to any here to satisfy the TS compiler for the password assignment
        (this as any).password = await bcrypt.hash((this as any).password, salt);
    } catch (error) {
        // In async hooks, throwing an error is the same as next(error)
        throw error;
    }
});


// Model creation and export
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;