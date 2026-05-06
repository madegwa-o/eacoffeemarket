import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Exhibitor } from "@/models/Exhibitor";

export async function GET(req: Request) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search");
  const industry = searchParams.getAll("industry");
  const country = searchParams.get("country");
  const sponsor = searchParams.get("sponsor_level");
  const query: Record<string, unknown> = {};
  if (search) query.company_name = { $regex: search, $options: "i" };
  if (industry.length) query.industries = { $in: industry };
  if (country) query.country = country;
  if (sponsor) query.sponsor_level = sponsor;
  const exhibitors = await Exhibitor.find(query).lean();
  return NextResponse.json(exhibitors);
}
