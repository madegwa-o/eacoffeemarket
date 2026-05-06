import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ExhibitorDashboard() {
  const session = await auth();
  if (!session?.user || session.user.role !== "exhibitor") redirect("/");
  const base = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const meetings = await fetch(`${base}/api/meetings?role=exhibitor`, { cache: "no-store" }).then((r) => r.json());
  return <main className="p-6"><h1 className="text-2xl font-bold text-blue-600">Exhibitor Dashboard</h1><pre>{JSON.stringify(meetings, null, 2)}</pre></main>;
}
