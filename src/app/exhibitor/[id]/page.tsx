import { auth } from "@/lib/auth";
import { MeetingModal } from "@/components/MeetingModal";

export default async function ExhibitorProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const base = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const exhibitor = await fetch(`${base}/api/exhibitors/${id}`, { cache: "no-store" }).then((r) => r.json());
  const session = await auth();
  return <main className="min-h-screen bg-white p-6"><h1 className="text-3xl font-bold">{exhibitor.company_name}</h1><p>{exhibitor.description}</p>{session?.user?.role === "buyer" ? <MeetingModal exhibitorId={id} /> : null}</main>;
}
