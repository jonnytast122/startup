import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  // Here you would normally save to your DB, send email, etc.
  // For demo, just echo back the data.
  return NextResponse.json({ success: true, user: body });
}
