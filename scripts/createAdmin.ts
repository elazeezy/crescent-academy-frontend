// scripts/createAdmin.ts
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import path from 'path';
import dbConnect from "../lib/mongodb"; // Use relative paths, not aliases
import User from "../models/User";

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

async function createAdmin() {
    if (!MONGODB_URI) {
        console.error("MONGODB_URI is missing in .env.local");
        process.exit(1);
    }

    try {
        console.log("Connecting directly to MongoDB...");
        await mongoose.connect(MONGODB_URI);

        // Define a local schema to avoid importing the model file and causing path errors
        const UserSchema = new mongoose.Schema({
            name: { type: String, required: true },
            email: { type: String, required: true, unique: true },
            password: { type: String, required: true },
            role: { type: String, required: true },
            createdAt: { type: Date, default: Date.now },
        });

        const User = mongoose.models.User || mongoose.model('User', UserSchema);

        const email = 'admin@crescent.edu.ng';
        
        // Clear existing to prevent duplicates shown in your Atlas screenshot
        await User.deleteMany({ email });

        // We manually hash here because we are using a local schema
        const hashedPassword = await bcrypt.hash('admin123', 10);

        await User.create({
            name: 'Admin User',
            email: email,
            password: hashedPassword,
            role: 'admin',
        });

        console.log(`-----------------------------------`);
        console.log(`SUCCESS: Admin created!`);
        console.log(`Email: ${email}`);
        console.log(`Password: admin123`);
        console.log(`-----------------------------------`);
        
        process.exit(0);
    } catch (err) {
        console.error('Script Error:', err);
        process.exit(1);
    }
}

createAdmin();