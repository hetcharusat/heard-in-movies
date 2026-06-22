import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({ error: "Query parameter 'q' is required" }, { status: 400 });
  }

  try {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=8`;
    
    const res = await fetch(url);
    if (!res.ok) {
      return NextResponse.json({ results: [] }); 
    }

    const data = await res.json();
    if (!data.results || !Array.isArray(data.results)) {
      return NextResponse.json({ results: [] });
    }
    
    const songs = data.results.map((item: any) => ({
      id: String(item.trackId),
      title: item.trackName,
      artist: item.artistName,
      videoId: String(item.trackId), // We don't have a videoId, but we need an ID for the UI
      url: `https://youtube.com/results?search_query=${encodeURIComponent(item.trackName + ' ' + item.artistName)}`,
    }));

    return NextResponse.json({ results: songs });
  } catch (error) {
    console.error("Error in song search route:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
