"use client";

import { ArchiveEntry } from "@/lib/types";
import { Search, Filter } from "lucide-react";
import { useState, useMemo } from "react";
import { Input } from "./ui/Input";
import { ListCard } from "./ListCard";
import { motion, AnimatePresence } from "framer-motion";

interface ArchiveTableProps {
  initialEntries: ArchiveEntry[];
}

export function ArchiveTable({ initialEntries }: ArchiveTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<string>("All");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const entries = [...initialEntries];

  const uniqueMovies = useMemo(() => {
    const movies = new Set(entries.map(e => e.movie));
    return ["All", ...Array.from(movies).sort()];
  }, [entries]);

  const filteredEntries = useMemo(() => {
    let result = entries.filter(entry => {
      const matchesSearch = 
        entry.song.toLowerCase().includes(searchQuery.toLowerCase()) || 
        entry.artist.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesMovie = selectedMovie === "All" || entry.movie === selectedMovie;

      return matchesSearch && matchesMovie;
    });

    if (sortOrder === "desc") {
      result = result.reverse();
    }
    
    return result;
  }, [entries, searchQuery, selectedMovie, sortOrder]);

  if (initialEntries.length === 0) {
    return (
      <div className="brutal-card p-8 flex items-center justify-center bg-yellow-300 text-black">
        <span className="font-bold text-xl uppercase tracking-tighter">No songs found. Add one!</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      
      <div className="brutal-card bg-white flex flex-col z-10 overflow-hidden border-b-4 border-black relative">
        <AnimatePresence initial={false} mode="wait">
          {!isSearchOpen ? (
            <motion.button 
              key="button"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 44 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsSearchOpen(true)}
              className="w-full flex items-center justify-center gap-2 text-sm font-press uppercase tracking-wider bg-white hover:bg-gray-100 transition-colors py-3 overflow-hidden"
            >
              <Search size={16} strokeWidth={3} />
              <span className="text-[10px]">Search & Filter</span>
            </motion.button>
          ) : (
            <motion.div 
              key="panel"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex flex-col gap-4 p-4 overflow-hidden"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-press uppercase tracking-widest text-[10px] text-black">Filters</span>
                <button onClick={() => setIsSearchOpen(false)} className="text-black font-press uppercase text-[8px] border-b-2 border-black hover:text-black/70 transition-colors">Close</button>
              </div>
              
              <Input 
                icon 
                placeholder="Search song or artist..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClear={() => setSearchQuery("")}
                className="font-vt text-lg"
              />
              
              <div className="flex flex-col gap-2">
                <label className="text-sm font-press text-[10px] uppercase tracking-wider text-black flex items-center gap-1">
                  <Filter size={16} strokeWidth={3} /> Filter by Movie
                </label>
                <div className="relative">
                  <select
                    value={selectedMovie}
                    onChange={(e) => setSelectedMovie(e.target.value)}
                    className="brutal-input w-full p-3 font-vt text-base appearance-none cursor-pointer"
                  >
                    {uniqueMovies.map(movie => (
                      <option key={movie} value={movie}>{movie}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-black">
                    ▼
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-press text-[10px] uppercase tracking-wider text-black flex items-center gap-1">
                  <Filter size={16} strokeWidth={3} /> Sort By Date
                </label>
                <div className="relative">
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as "desc" | "asc")}
                    className="brutal-input w-full p-3 font-vt text-base appearance-none cursor-pointer"
                  >
                    <option value="desc">Newest First</option>
                    <option value="asc">Oldest First</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-black">
                    ▼
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div 
        layout
        className="flex flex-col gap-3"
      >
        {filteredEntries.length === 0 ? (
           <motion.div layout className="brutal-card p-4 flex items-center justify-center bg-gray-200 text-black">
             <span className="font-bold uppercase tracking-tighter text-sm">No matches found.</span>
           </motion.div>
        ) : (
          filteredEntries.map((entry, idx) => {
            const colors = ['bg-yellow-300', 'bg-cyan-300', 'bg-fuchsia-300', 'bg-green-300'];
            const bgColor = colors[idx % colors.length];

            return <ListCard key={entry.id} entry={entry} bgColor={bgColor} />;
          })
        )}
      </motion.div>
    </div>
  );
}
