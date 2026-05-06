import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { MeetingRequest } from "@/models/MeetingRequest";
import { User } from "@/models/User";
import { Exhibitor } from "@/models/Exhibitor";

const createSchema = z.object({ exhibitor_id: z.string(), message: z.string().min(1), proposed_time: z.string() });

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "buyer") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = createSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  await connectDB();
  const created = await MeetingRequest.create({ buyer_id: session.user.id, ...parsed.data, proposed_time: new Date(parsed.data.proposed_time), status: "pending" });
  return NextResponse.json(created);
}

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const role = new URL(req.url).searchParams.get("role");
  if (role === "buyer") {
    const rows = await MeetingRequest.find({ buyer_id: session.user.id }).populate("exhibitor_id", "company_name").lean();
    return NextResponse.json(rows);
  }
  const exhibitorUser = await User.findById(session.user.id).lean();
  const exhibitor = await Exhibitor.findOne({ company_name: exhibitorUser?.company }).lean();
  const rows = await MeetingRequest.find({ exhibitor_id: exhibitor?._id }).populate("buyer_id", "username").lean();
  return NextResponse.json(rows);
}
