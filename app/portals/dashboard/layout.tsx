import { auth } from "../../../auth";
import { redirect } from "next/navigation";

// Each role (admin, teacher, student) has its own layout file.
// This root layout just guards the /portals/dashboard entry point
// and passes through to the role-specific layout below.
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return <>{children}</>;
}
