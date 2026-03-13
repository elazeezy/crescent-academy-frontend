import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id: string;
    role: string;
    assignedClass?: string;
  }

  interface Session {
    user: {
      id: string;
      role: string;
      assignedClass?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role?: string;         // Change to ?
    assignedClass?: string; // Change to ?
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    assignedClass?: string;
  }
}