// types/next-auth.d.ts
import { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

// 1. Extend the session user
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      assignedClass?: string;
    } & DefaultSession["user"];
  }

  // 2. Extend the user object
  interface User {
    id: string;
    role: string;
    assignedClass?: string;
  }
}

// 3. Extend the JWT
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    assignedClass?: string;
  }
}