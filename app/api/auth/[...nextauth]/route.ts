import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

/**
 * AUTH CONFIGURATION FOR CRESCENT ACADEMY
 * Handles login authentication with MongoDB
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
          // Validate credentials exist
          if (!credentials?.email || !credentials?.password) {
            console.log("❌ Missing email or password");
            return null;
          }

          const email = String(credentials.email).trim().toLowerCase();
          const password = String(credentials.password).trim();

          // Connect to database
          await dbConnect();

          const user = await User.findOne({
  email: { $regex: new RegExp(`^${email}$`, "i") },
}).lean() as any; // <--- ADD 'as any' HERE to bypass Mongoose strict typing

// Now TypeScript will stop complaining about missing properties on the Mongoose object
if (!user) {
  console.log(`❌ No user found for: ${email}`);
  return null;
}

          // Verify password
          const isPasswordValid = await bcrypt.compare(
            password,
            user.password as string
          );

          if (!isPasswordValid) {
            console.log(`❌ Invalid password for: ${email}`);
            return null;
          }

          console.log(`✅ User authenticated: ${email}`);

          // Return user data (must match User interface from types/next-auth.d.ts)
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            assignedClass: user.assignedClass || undefined,
          };
        } catch (error) {
          console.error("❌ Authorization error:", error);
          return null;
        }
      },
    }),
  ],

  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  callbacks: {
    /**
     * JWT Callback - Store user data in token
     */
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.assignedClass = user.assignedClass;
      }
      return token;
    },

    /**
     * Session Callback - Make user data available to client
     */
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.assignedClass = token.assignedClass;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

/**
 * Export NextAuth handlers for Next.js 14 App Router
 */
const { handlers } = NextAuth(authOptions);
export const { GET, POST } = handlers;