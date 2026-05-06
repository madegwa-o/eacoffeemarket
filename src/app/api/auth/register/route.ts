import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";

const schema = z.object({ username: z.string().min(3), password: z.string().min(8), role: z.enum(["buyer", "exhibitor"]) });

export async function POST(req: Request) {
  const json = await req.json();
  const parsed = schema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  await connectDB();
  const exists = await User.findOne({ username: parsed.data.username });
  if (exists) return NextResponse.json({ error: "Username already exists" }, { status: 409 });
  const password_hash = await bcrypt.hash(parsed.data.password, 10);
  const created = await User.create({ ...parsed.data, password_hash });
  return NextResponse.json({ id: created._id });
}
