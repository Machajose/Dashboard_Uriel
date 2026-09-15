import { NextRequest, NextResponse } from "next/server";
import { createSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  if (password === process.env.DASHBOARD_PASSWORD) {
    await createSession();
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: false, error: "Wrong password" }, { status: 401 });
}