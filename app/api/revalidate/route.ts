import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function GET() {
  revalidateTag("entries", "max");
  return NextResponse.json({ revalidated: true, now: Date.now() });
}

export async function POST() {
  revalidateTag("entries", "max");
  return NextResponse.json({ revalidated: true, now: Date.now() });
}
