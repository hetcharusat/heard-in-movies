import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL;

export async function GET(request: Request) {
  if (!APPS_SCRIPT_URL) {
    return NextResponse.json({ error: 'APPS_SCRIPT_URL not set' }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action") || "entries";

  try {
    const res = await fetch(`${APPS_SCRIPT_URL}?action=${action}`, {
      cache: "force-cache",
      next: { tags: ["entries"] },
    });
    
    if (!res.ok) throw new Error("Failed to fetch from Google Apps Script");
    
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error proxying GET to Apps Script:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!APPS_SCRIPT_URL) {
    return NextResponse.json({ error: 'APPS_SCRIPT_URL not set' }, { status: 500 });
  }

  try {
    const body = await request.json();
    
    // Apps script requires follow redirects because POST returns a 302 redirect
    const res = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify(body),
      redirect: "follow",
    });

    const data = await res.json();
    
    // Instantly invalidate the cache so the list updates
    revalidateTag("entries", "max");

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error proxying POST to Apps Script:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
