import { auth } from "../../../auth";
import { redirect } from "next/navigation";

// Guards the entire /portals/dashboard/* tree.
// Role-based redirect lives in page.tsx (only fires on the bare /portals/dashboard route).
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return <>{children}</>;
}
