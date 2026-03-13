import NextAuth from "next-auth";
import type { NextAuthConfig, User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

/**
 * 1. FINALIZED TYPE AUGMENTATION
 * Consolidated into one block to fix:
 * - "Invalid module name in augmentation"
 * - "Identical modifiers"
 */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
    } & import("next-auth").DefaultSession["user"];
  }

  interface User {
    role?: string; // Optional here to match internal library modifiers
  }

  interface JWT {
    id: string;
    role: string;
  }
}

/**
 * 2. AUTH CONFIGURATION
 */
export const authOptions: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
  try {
    if (!credentials?.email || !credentials?.password) return null;

    const email = String(credentials.email).trim().toLowerCase();
    const password = String(credentials.password).trim();

    await dbConnect();

    // The Regex search you added (Correct!)
    const user = await User.findOne({ 
      email: { $regex: new RegExp(`^${email}$`, 'i') } 
    }).lean();

    // FIX: This "Guard" clears all those "user is possibly null" errors
    if (!user) {
      console.log(`No user found for: ${email}`);
      return null;
    }

    // Now TypeScript knows 'user' exists for these lines
    const isPasswordValid = await bcrypt.compare(password, user.password as string);
    console.log("Password check result:", isPasswordValid);
    
    if (!isPasswordValid) {
      console.log(`Invalid password for: ${email}`);
      return null;
    }

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role, 
    };
  } catch (error) {
    console.error("Authorize error:", error);
    return null;
  }
}
    }),
  ],

  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = (user as any).role as string;
      }
      return token;
    },

    async session({ session, token }) {
      // Explicitly casting clears: "Type 'unknown' is not assignable to type 'string'"
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

// 3. HANDLER EXPORT
const { handlers } = NextAuth(authOptions);
export const { GET, POST } = handlers;