import { auth } from "@/auth";
import { redirect } from "next/navigation";

const ROLE_PATHS: Record<string, string> = {
  admin:   '/portals/dashboard/admin',
  teacher: '/portals/dashboard/teacher',
  student: '/portals/dashboard/student',
};

// Handles GET /portals/dashboard — redirects to the correct role dashboard.
// The layout guards auth; this page only fires on the exact bare route.
export default async function DashboardIndexPage() {
  const session = await auth();
  const role = (session?.user as any)?.role as string;
  redirect(ROLE_PATHS[role] ?? '/login');
}
