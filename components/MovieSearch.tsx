"use client";

import { useState, useEffect } from "react";
import { Input } from "./ui/Input";
import { useDebounce } from "@/hooks/useDebounce";
import { Movie } from "@/lib/types";
import { Film, Loader2 } from "lucide-react";

interface MovieSearchProps {
  onSelect: (movie: Movie) => void;
  selectedMovie: Movie | null;
}

export function MovieSearch({ onSelect, selectedMovie }: MovieSearchProps) {
  const [query, setQuery] = useState(selectedMovie ? selectedMovie.title : "");
  const [results, setResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  const debouncedQuery = useDebounce(query, 1000);

  useEffect(() => {
    if (selectedMovie && query === selectedMovie.title) {
      setIsOpen(false);
      return;
    }

    if (!debouncedQuery.trim() || debouncedQuery.trim().length < 3) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const searchMovies = async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/movies?q=${encodeURIComponent(debouncedQuery)}`);
        const data = await res.json();
        if (data.results) {
          setResults(data.results);
          setIsOpen(true);
        }
      } catch (error) {
        console.error("Failed to search movies", error);
      } finally {
        setIsSearching(false);
      }
    };

    searchMovies();
  }, [debouncedQuery, selectedMovie, query]);

  const handleSelect = (movie: Movie) => {
    setQuery(movie.title);
    setIsOpen(false);
    onSelect(movie);
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full z-10">
      <div className="relative">
        <Input
          label="Search Movie"
          icon
          placeholder="e.g. Fight Club"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { if (results.length > 0) setIsOpen(true); }}
          onClear={handleClear}
        />
        {isSearching && (
          <div className="absolute right-12 top-[38px] text-accent-primary animate-spin">
            <Loader2 size={18} />
          </div>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 mt-2 w-full brutal-card bg-white max-h-60 overflow-y-auto hide-scrollbar z-50 animate-in fade-in slide-in-from-top-2 duration-300">
          {results.map((movie) => (
            <button
              key={movie.id}
              onClick={() => handleSelect(movie)}
              className="w-full text-left px-4 py-3 border-b-4 border-black hover:bg-yellow-300 active:bg-cyan-300 transition-colors flex items-start gap-3 last:border-b-0"
            >
              <div className="mt-0.5 text-black border-2 border-black p-1.5 bg-cyan-300 flex-shrink-0">
                <Film size={16} strokeWidth={3} />
              </div>
              <div className="flex flex-col overflow-hidden text-black pt-0.5">
                <span className="font-black truncate w-full leading-tight">{movie.title}</span>
                <span className="text-xs font-bold truncate w-full text-black/70">
                  {movie.year ? movie.year : "Unknown Year"}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
