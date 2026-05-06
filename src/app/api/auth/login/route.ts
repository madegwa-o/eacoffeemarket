import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ message: "Use NextAuth credentials signIn on client (/api/auth/signin)." });
}
