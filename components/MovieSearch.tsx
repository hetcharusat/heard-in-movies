"use client";

import { useState, useEffect } from "react";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { useDebounce } from "@/hooks/useDebounce";
import { Movie } from "@/lib/types";
import { Film, Loader2, Search, AlertCircle } from "lucide-react";

interface MovieSearchProps {
  onSelect: (movie: Movie) => void;
  selectedMovie: Movie | null;
}

export function MovieSearch({ onSelect, selectedMovie }: MovieSearchProps) {
  const [query, setQuery] = useState(selectedMovie ? selectedMovie.title : "");
  const [results, setResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  
  const debouncedQuery = useDebounce(query, 1000);

  const handleSearch = async (q: string) => {
    if (!q.trim()) return;
    setIsSearching(true);
    setError("");
    try {
        const res = await fetch(`/api/movies?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        if (data.results) {
          setResults(data.results);
          setIsOpen(true);
        }
    } catch (err) {
        console.error("Failed to search movies", err);
        setError("Failed to search movies. Please try again.");
    } finally {
        setIsSearching(false);
    }
  };

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

    handleSearch(debouncedQuery);
  }, [debouncedQuery, selectedMovie, query]);

  return (
    <div className="relative w-full z-10">
      <h2 className="text-xl font-press uppercase tracking-tighter text-black flex items-center gap-2 mb-4">
        <Film size={24} strokeWidth={3} />
        Find Movie
      </h2>
      <div className="flex gap-2 relative">
        <Input 
          icon 
          placeholder="Search for a movie..." 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onClear={() => setQuery("")}
          className="font-vt text-xl"
        />
        <Button 
          onClick={() => handleSearch(query)} 
          isLoading={isSearching}
          disabled={!query || isSearching}
          className="!px-4"
        >
          <Search size={20} strokeWidth={3} />
        </Button>
      </div>

      {error && (
        <p className="text-sm font-bold text-red-600 bg-white border-2 border-black p-2 flex items-center gap-1 font-vt text-lg mt-2">
          <AlertCircle size={16} strokeWidth={3} />
          {error}
        </p>
      )}

      {results.length > 0 && !selectedMovie && isOpen && (
        <div className="flex flex-col gap-2 mt-2">
          <h3 className="text-xs font-press uppercase tracking-widest text-black/60 mb-1">Results</h3>
          <div className="flex flex-col gap-2">
            {results.map((movie) => (
              <div 
                key={movie.id}
                onClick={() => {
                  onSelect(movie);
                  setIsOpen(false);
                  setQuery(movie.title);
                }}
                className="brutal-card bg-white p-3 cursor-pointer hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col gap-1"
              >
                <span className="font-bold text-lg leading-tight line-clamp-1">{movie.title}</span>
                <span className="text-sm font-vt uppercase tracking-widest text-black/60">{movie.year}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedMovie && (
        <div className="mt-2 brutal-card bg-cyan-400 p-4 flex justify-between items-center relative overflow-hidden">
          <div className="flex flex-col z-10">
            <span className="text-[10px] font-press uppercase tracking-widest text-black/60 mb-1">Selected Movie</span>
            <span className="font-bold text-xl leading-tight line-clamp-1">{selectedMovie.title}</span>
            <span className="text-sm font-vt uppercase tracking-widest">{selectedMovie.year}</span>
          </div>
          <button 
            onClick={() => {
              onSelect(null as any);
              setQuery("");
            }}
            className="text-xs font-press uppercase border-b-2 border-black hover:text-black/60 transition-colors z-10 text-[8px]"
          >
            Change
          </button>
        </div>
      )}
    </div>
  );
}
