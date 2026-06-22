"use client";

import { ArchiveEntry } from "@/lib/types";
import { Music, Calendar, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import { generateMarkdown } from "@/lib/markdown";

interface ListCardProps {
  entry: ArchiveEntry;
  bgColor: string;
}

export function ListCard({ entry, bgColor }: ListCardProps) {
  const [isPressing, setIsPressing] = useState(false);
  const [copied, setCopied] = useState(false);
  const pressTimer = useRef<NodeJS.Timeout | null>(null);

  const startPress = () => {
    if (copied) return;
    setIsPressing(true);
    
    // Set timer for 2.5 seconds
    pressTimer.current = setTimeout(async () => {
      setIsPressing(false);
      
      const markdown = generateMarkdown({
        number: entry.number,
        songTitle: entry.song,
        artist: entry.artist,
        url: entry.link,
        movieTitle: entry.movie,
        year: entry.year
      });
      
      try {
        await navigator.clipboard.writeText(markdown);
        setCopied(true);
        setTimeout(() => setCopied(false), 800);
      } catch (err) {
        console.error("Failed to copy", err);
      }
    }, 2500);
  };

  const cancelPress = () => {
    setIsPressing(false);
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className={`brutal-card p-3 ${bgColor} flex flex-col relative overflow-hidden cursor-pointer select-none`}
      onPointerDown={(e) => {
        // Prevent default touch actions like text selection on long press
        e.currentTarget.setPointerCapture(e.pointerId);
        startPress();
      }}
      onPointerUp={(e) => {
        e.currentTarget.releasePointerCapture(e.pointerId);
        cancelPress();
      }}
      onPointerCancel={cancelPress}
      onContextMenu={(e) => {
        // Prevent right click menu on mobile so long press works smoothly
        if (isPressing) e.preventDefault();
      }}
      style={{ WebkitTouchCallout: "none" }}
    >
      {/* Progress Filler overlay */}
      <motion.div 
        className="absolute inset-0 bg-black/10 origin-left z-0 pointer-events-none"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isPressing ? 1 : 0 }}
        transition={{ 
          duration: isPressing ? 2.5 : 0.3, 
          ease: isPressing ? "linear" : "easeOut" 
        }}
      />
      
      <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white border-2 border-black flex items-center justify-center font-black text-[10px] z-10 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] font-vt text-sm">
        #{entry.number}
      </div>

      <div className="flex items-start justify-between z-10 w-full gap-2 pr-4 relative pointer-events-none">
        <div className="flex flex-col overflow-hidden">
          <h2 className="text-base sm:text-xl font-press text-black leading-tight line-clamp-2 mb-2 pointer-events-none">{entry.song}</h2>
          <h3 className="text-sm font-vt text-black/80 uppercase tracking-widest flex items-center gap-1 pointer-events-none">
            <Music size={12} strokeWidth={3} />
            <span className="truncate">{entry.artist}</span>
          </h3>
        </div>
      </div>
      
      <div className="h-0.5 w-full bg-black/20 my-2 relative z-10 pointer-events-none"></div>
      
      <div className="flex items-end justify-between relative z-10 pointer-events-none">
        <div className="flex flex-col max-w-[60%]">
          <span className="text-[9px] font-black uppercase text-black/60">Heard In</span>
          <span className="font-bold text-xs line-clamp-1 bg-white border border-black px-1.5 py-0.5 mt-0.5 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] font-vt text-base">
            {entry.movie} <span className="text-xs ml-1">({entry.year})</span>
          </span>
        </div>

        {entry.link && (
          <div className="pointer-events-auto">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                window.open(entry.link, '_blank');
              }}
              onPointerDown={(e) => e.stopPropagation()}
              className="w-fit self-end brutal-btn !bg-white border-2 border-black flex items-center justify-center gap-1.5 px-2 py-1 hover:bg-gray-100 transition-colors text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] z-20 relative"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-red-600">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              <span className="font-black uppercase tracking-wider text-[10px]">YouTube</span>
            </button>
          </div>
        )}
      </div>

      {/* Success Popup */}
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm pointer-events-none"
          >
            <div className="brutal-card bg-green-400 p-3 flex items-center gap-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black">
              <Check size={20} strokeWidth={4} />
              <span className="font-black uppercase tracking-widest text-sm">Copied!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
