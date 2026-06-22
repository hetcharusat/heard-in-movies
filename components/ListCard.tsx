"use client";

import { ArchiveEntry } from "@/lib/types";
import { Music, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useCallback } from "react";
import { generateMarkdown } from "@/lib/markdown";

interface ListCardProps {
  entry: ArchiveEntry;
  bgColor: string;
  index?: number;
}

export function ListCard({ entry, bgColor, index = 0 }: ListCardProps) {
  const [isPressing, setIsPressing] = useState(false);
  const [copied, setCopied] = useState(false);
  const pressTimer = useRef<NodeJS.Timeout | null>(null);
  const startPos = useRef<{ x: number; y: number } | null>(null);
  const isPressingRef = useRef(false);

  // Much more generous tolerance — 40px so natural finger wobble never cancels
  const MOVE_TOLERANCE = 40;

  const doClipboard = useCallback(async () => {
    const markdown = generateMarkdown({
      number: entry.number,
      songTitle: entry.song,
      artist: entry.artist,
      url: entry.link,
      movieTitle: entry.movie,
      year: entry.year,
    });
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  }, [entry]);

  const startPress = useCallback((clientX: number, clientY: number) => {
    if (copied) return;
    startPos.current = { x: clientX, y: clientY };
    isPressingRef.current = true;
    setIsPressing(true);

    pressTimer.current = setTimeout(async () => {
      if (!isPressingRef.current) return; // guard: still holding?
      isPressingRef.current = false;
      setIsPressing(false);
      startPos.current = null;
      await doClipboard();
    }, 2500);
  }, [copied, doClipboard]);

  const checkMove = useCallback((clientX: number, clientY: number) => {
    if (!startPos.current || !isPressingRef.current) return;
    const dx = Math.abs(clientX - startPos.current.x);
    const dy = Math.abs(clientY - startPos.current.y);
    if (dx > MOVE_TOLERANCE || dy > MOVE_TOLERANCE) {
      cancelPress();
    }
  }, []);

  const cancelPress = useCallback(() => {
    isPressingRef.current = false;
    setIsPressing(false);
    startPos.current = null;
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  }, []);

  return (
    <div className="w-full">
      <motion.div
        className={`brutal-card p-3 ${bgColor} flex flex-col relative overflow-hidden cursor-pointer select-none`}
        /* Pointer events (works on all devices) */
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          startPress(e.clientX, e.clientY);
        }}
        onPointerMove={(e) => checkMove(e.clientX, e.clientY)}
        onPointerUp={() => cancelPress()}
        onPointerCancel={() => cancelPress()}
        onContextMenu={(e) => e.preventDefault()}
        style={{
          WebkitTouchCallout: "none",
          WebkitUserSelect: "none",
          userSelect: "none",
          // keep default touch-action so the browser still scrolls; we
          // cancel long-press ourselves via move-tolerance
          touchAction: "pan-y",
        }}
      >
        {/* Progress fill overlay */}
        <motion.div
          className="absolute inset-0 bg-black/15 origin-left z-0 pointer-events-none"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isPressing ? 1 : 0 }}
          transition={{
            duration: isPressing ? 2.5 : 0.25,
            ease: isPressing ? "linear" : "easeOut",
          }}
        />

        {/* Number badge — eclipse half-cut circle design in the top-right corner */}
        <div className="absolute top-0 right-0 z-10 pointer-events-none">
          <div className="bg-white text-black font-press text-[8px] border-l-2 border-b-2 border-black w-8 h-8 flex items-center justify-center rounded-bl-full pl-1.5 pb-1.5 shadow-[inset_1px_-1px_0px_0px_rgba(0,0,0,0.15)]">
            {entry.number}
          </div>
        </div>

        <div className="flex items-start justify-between z-10 w-full gap-2 pr-10 relative pointer-events-none">
          <div className="flex flex-col overflow-hidden">
            <h2 className="text-base sm:text-xl font-press text-black leading-tight line-clamp-2 mb-2 pointer-events-none">
              {entry.song}
            </h2>
            <h3 className="text-sm font-vt text-black/80 uppercase tracking-widest flex items-center gap-1 pointer-events-none">
              <Music size={12} strokeWidth={3} />
              <span className="truncate">{entry.artist}</span>
            </h3>
          </div>
        </div>

        <div className="h-0.5 w-full bg-black/20 my-2 relative z-10 pointer-events-none" />

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
                  window.open(entry.link, "_blank");
                }}
                onPointerDown={(e) => e.stopPropagation()}
                className="w-fit self-end brutal-btn !bg-white border-2 border-black flex items-center justify-center gap-1.5 px-2 py-1 hover:bg-gray-100 transition-colors text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] z-20 relative"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-red-600">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                <span className="font-black uppercase tracking-wider text-[10px]">YouTube</span>
              </button>
            </div>
          )}
        </div>

        {/* Copied success overlay */}
        <AnimatePresence>
          {copied && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm pointer-events-none"
            >
              <motion.div
                initial={{ y: 10 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="brutal-card bg-green-400 px-5 py-3 flex items-center gap-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black"
              >
                <Check size={22} strokeWidth={4} />
                <span className="font-press uppercase tracking-widest text-sm">Copied!</span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
