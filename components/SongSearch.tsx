"use client";

import { useState, useEffect } from "react";
import { Input } from "./ui/Input";
import { useDebounce } from "@/hooks/useDebounce";
import { Song } from "@/lib/types";
import { Music, Loader2 } from "lucide-react";

interface SongSearchProps {
  onSelect: (song: Song) => void;
  selectedSong: Song | null;
}

export function SongSearch({ onSelect, selectedSong }: SongSearchProps) {
  const [query, setQuery] = useState(selectedSong ? selectedSong.title : "");
  const [results, setResults] = useState<Song[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  const debouncedQuery = useDebounce(query, 1000);

  useEffect(() => {
    if (selectedSong && query === selectedSong.title) {
      setIsOpen(false);
      return;
    }

    if (!debouncedQuery.trim() || debouncedQuery.trim().length < 3) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const searchSongs = async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/songs?q=${encodeURIComponent(debouncedQuery)}`);
        const data = await res.json();
        if (data.results) {
          setResults(data.results);
          setIsOpen(true);
        }
      } catch (error) {
        console.error("Failed to search songs", error);
      } finally {
        setIsSearching(false);
      }
    };

    searchSongs();
  }, [debouncedQuery, selectedSong, query]);

  const handleSelect = (song: Song) => {
    setQuery(song.title);
    setIsOpen(false);
    onSelect(song);
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
    // Let parent handle clear if needed
  };

  return (
    <div className="relative w-full z-20">
      <div className="relative">
        <Input
          label="Search Song"
          icon
          placeholder="e.g. Where Is My Mind"
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
          {results.map((song) => (
            <button
              key={song.id}
              onClick={() => handleSelect(song)}
              className="w-full text-left px-4 py-3 border-b-4 border-black hover:bg-yellow-300 active:bg-cyan-300 transition-colors flex items-start gap-3 last:border-b-0"
            >
              <div className="mt-0.5 text-black border-2 border-black p-1.5 bg-fuchsia-300">
                <Music size={16} strokeWidth={3} />
              </div>
              <div className="flex flex-col overflow-hidden text-black">
                <span className="font-black truncate w-full">{song.title}</span>
                <span className="text-xs font-bold truncate w-full">{song.artist}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
