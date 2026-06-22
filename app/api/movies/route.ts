import { NextResponse } from "next/server";

const TMDB_API_KEY = process.env.TMDB_API_KEY;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({ error: "Query parameter 'q' is required" }, { status: 400 });
  }

  if (!TMDB_API_KEY) {
    return NextResponse.json({ error: "TMDB API key not configured" }, { status: 500 });
  }

  try {
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`;
    
    const res = await fetch(url, {
      headers: {
        accept: "application/json",
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("TMDB API Error:", errorData);
      throw new Error("Failed to fetch from TMDB API");
    }

    const data = await res.json();
    
    if (!data.results || !Array.isArray(data.results)) {
      return NextResponse.json({ results: [] });
    }
    
    const movies = data.results.slice(0, 8).map((movie: any) => ({
      id: movie.id,
      title: movie.title,
      year: movie.release_date ? parseInt(movie.release_date.split("-")[0]) : null,
      posterPath: movie.poster_path ? `https://image.tmdb.org/t/p/w92${movie.poster_path}` : null,
    }));

    return NextResponse.json({ results: movies });
  } catch (error) {
    console.error("Error in movie search route:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
