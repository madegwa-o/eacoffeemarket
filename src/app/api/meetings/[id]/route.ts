import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { MeetingRequest } from "@/models/MeetingRequest";

const schema = z.object({ status: z.enum(["accepted", "rejected"]) });

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "exhibitor") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  await connectDB();
  const { id } = await params;
  const updated = await MeetingRequest.findByIdAndUpdate(id, { status: parsed.data.status }, { new: true });
  return NextResponse.json(updated);
}
