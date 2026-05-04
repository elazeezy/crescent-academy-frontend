import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Teacher from "@/models/Teacher";
import bcrypt from "bcryptjs";

export const { auth, signIn, signOut, handlers } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = String(credentials.email).trim().toLowerCase();
        const password = String(credentials.password);

        try {
          await dbConnect();

          // Direct index hit on email (email field has unique index) — no regex needed
          const user = await User.findOne({ email }).lean() as any;
          if (!user) return null;

          // Run bcrypt in parallel with teacher lookup — saves one full round-trip for teachers
          const [isValid, teacher] = await Promise.all([
            bcrypt.compare(password, user.password as string),
            user.role === "teacher"
              ? Teacher.findOne({ user: user._id }, { assignedClass: 1 }).lean()
              : Promise.resolve(null),
          ]);

          if (!isValid) return null;

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            assignedClass: (teacher as any)?.assignedClass,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.assignedClass = user.assignedClass;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.assignedClass = token.assignedClass as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
  debug: process.env.NODE_ENV === "development",
});
