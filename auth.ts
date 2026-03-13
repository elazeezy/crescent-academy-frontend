import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "./lib/dbConnect";
import User from "./models/User";
import Teacher from "./models/Teacher";
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
        await dbConnect();
        const user = await User.findOne({ email: credentials?.email as string });

        if (user && await bcrypt.compare(credentials?.password as string, user.password as string)) {
          let assignedClass = undefined;
          
          if (user.role === "teacher") {
            const teacher = await Teacher.findOne({ user: user._id });
            assignedClass = teacher?.assignedClass;
          }

          // Return the user object, including the ID
          return {
            id: user._id.toString(), // Important: This 'id' is used in the jwt callback
            name: user.name,
            email: user.email,
            role: user.role,
            assignedClass: assignedClass,
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // Store database ID in token
        token.role = user.role;
        token.assignedClass = user.assignedClass;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string; // Map token ID to session user
        session.user.role = token.role as string;
        session.user.assignedClass = token.assignedClass as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});