import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

async function createAdmin() {
  if (!MONGODB_URI) {
    console.error('MONGODB_URI is missing in .env.local');
    process.exit(1);
  }

  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);

    // Import AFTER connecting so mongoose doesn't complain
    const { default: User } = await import('../models/User');

    const email = 'admin@crescent.edu.ng';
    const plainPassword = 'Crescent@Admin2026!';

    // Delete any existing admin to avoid duplicates
    await User.deleteMany({ email });

    // Pass PLAIN TEXT — the User model's pre-save hook hashes it automatically
    await User.create({
      name: 'Admin User',
      email,
      password: plainPassword,
      role: 'admin',
    });

    console.log('-----------------------------------');
    console.log('SUCCESS: Admin created!');
    console.log(`Email:    ${email}`);
    console.log(`Password: ${plainPassword}`);
    console.log('-----------------------------------');

    process.exit(0);
  } catch (err) {
    console.error('Script Error:', err);
    process.exit(1);
  }
}

createAdmin();
