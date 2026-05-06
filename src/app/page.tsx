import { ExhibitorCard } from "@/components/ExhibitorCard";
import { FilterSidebar } from "@/components/FilterSidebar";

async function getExhibitors(searchParams: Record<string, string | string[] | undefined>) {
  const qs = new URLSearchParams();
  if (searchParams.search) qs.set("search", String(searchParams.search));
  if (searchParams.country) qs.set("country", String(searchParams.country));
  if (searchParams.sponsor_level) qs.set("sponsor_level", String(searchParams.sponsor_level));
  const industries = searchParams.industry;
  if (industries) (Array.isArray(industries) ? industries : [industries]).forEach((i) => qs.append("industry", i));
  const base = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const res = await fetch(`${base}/api/exhibitors?${qs.toString()}`, { cache: "no-store" });
  return res.json();
}

export default async function Home({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const exhibitors = await getExhibitors(params);
  return <main className="min-h-screen bg-white p-6"><h1 className="text-3xl font-bold text-blue-600">EA Coffee B2B Matchmaking</h1><div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4"><FilterSidebar /><section className="md:col-span-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{exhibitors.map((e: { _id:string; logo_url:string; company_name:string; country:string; sponsor_level:string; description?:string }) => <ExhibitorCard key={e._id} exhibitor={e} />)}</section></div></main>;
}
