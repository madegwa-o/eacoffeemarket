import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Exhibitor } from "@/models/Exhibitor";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await params;
  const exhibitor = await Exhibitor.findById(id).lean();
  if (!exhibitor) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(exhibitor);
}
