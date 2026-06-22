"use client";

import { useState, useEffect } from "react";
import { SongSearch } from "./SongSearch";
import { MovieSearch } from "./MovieSearch";
import { MarkdownPreview } from "./MarkdownPreview";
import { Button } from "./ui/Button";
import { Song, Movie } from "@/lib/types";
import { generateMarkdown } from "@/lib/markdown";
import { saveEntry } from "@/lib/sheets";
import { Sparkles, Save, CheckCircle2, AlertCircle } from "lucide-react";

interface EntryFormProps {
  initialNextNumber: number;
}

export function EntryForm({ initialNextNumber }: EntryFormProps) {
  const [song, setSong] = useState<Song | null>(null);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [markdown, setMarkdown] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [nextNumber, setNextNumber] = useState(initialNextNumber);

  // Editable fields
  const [editedSongTitle, setEditedSongTitle] = useState("");
  const [editedArtist, setEditedArtist] = useState("");
  const [editedUrl, setEditedUrl] = useState("");
  const [editedMovieTitle, setEditedMovieTitle] = useState("");
  const [editedYear, setEditedYear] = useState<string | number>("");

  useEffect(() => {
    if (song) {
      setEditedSongTitle(song.title);
      setEditedArtist(song.artist);
      setEditedUrl(song.url);
    }
  }, [song]);

  useEffect(() => {
    if (movie) {
      setEditedMovieTitle(movie.title);
      setEditedYear(movie.year || "");
    }
  }, [movie]);

  useEffect(() => {
    if (!song || !movie) return;
    
    const md = generateMarkdown({
      number: nextNumber,
      songTitle: editedSongTitle,
      artist: editedArtist,
      url: editedUrl,
      movieTitle: editedMovieTitle,
      year: editedYear || "Unknown",
    });
    
    setMarkdown(md);
  }, [song, movie, nextNumber, editedSongTitle, editedArtist, editedUrl, editedMovieTitle, editedYear]);

  const handleSave = async () => {
    if (!song || !movie) return;
    
    setIsSaving(true);
    setSaveStatus("idle");
    
    const success = await saveEntry({
      song: editedSongTitle,
      artist: editedArtist,
      movie: editedMovieTitle,
      year: Number(editedYear) || 0,
      link: editedUrl,
    });
    
    setIsSaving(false);
    
    if (success) {
      setSaveStatus("success");
      // Increment number for next potential entry
      setNextNumber(prev => prev + 1);
      setTimeout(() => setSaveStatus("idle"), 3000);
    } else {
      setSaveStatus("error");
    }
  };

  const isReadyToGenerate = song !== null && movie !== null;

  return (
    <div className="flex flex-col gap-8 pb-8">
      
      {/* Search Sections (Stepper) */}
      <div className="flex flex-col gap-4 relative z-20">
        
        {/* Step 1: Song Search */}
        <div className="p-5 brutal-card bg-yellow-300 relative">
          <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-press text-sm border-2 border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] z-10">
            1
          </div>
          <SongSearch selectedSong={song} onSelect={setSong} />
        </div>

        {/* Step 2: Movie Search */}
        <div className={`p-5 brutal-card bg-cyan-300 relative transition-all duration-300 ${!song ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
          <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-press text-sm border-2 border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] z-10">
            2
          </div>
          <MovieSearch selectedMovie={movie} onSelect={setMovie} />
        </div>

      </div>

      {/* Auto-filled Preview Section */}
      {isReadyToGenerate && (
        <div className="flex flex-col gap-4 p-5 brutal-card bg-cyan-300 animate-in fade-in slide-in-from-bottom-4 relative z-10">
          <h3 className="text-lg font-press text-black tracking-tighter mb-2 border-b-4 border-black pb-2 mt-2">
            METADATA
          </h3>
          <div className="flex flex-col gap-3 font-bold text-black mt-2">
            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase tracking-widest text-black/60 font-vt text-lg">Song Title</label>
              <input 
                value={editedSongTitle} 
                onChange={(e) => setEditedSongTitle(e.target.value)} 
                className="bg-white border-2 border-black px-3 py-2 w-full focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all font-vt text-xl"
              />
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase tracking-widest text-black/60 font-vt text-lg">Artist</label>
              <input 
                value={editedArtist} 
                onChange={(e) => setEditedArtist(e.target.value)} 
                className="bg-white border-2 border-black px-3 py-2 w-full focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all font-vt text-xl"
              />
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase tracking-widest text-black/60 font-vt text-lg">URL</label>
              <input 
                value={editedUrl} 
                onChange={(e) => setEditedUrl(e.target.value)} 
                className="bg-white border-2 border-black px-3 py-2 w-full focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all font-vt text-xl"
              />
            </div>
            
            <div className="flex flex-col gap-1 mt-2">
              <label className="text-xs uppercase tracking-widest text-black/60 font-vt text-lg">Movie Title</label>
              <input 
                value={editedMovieTitle} 
                onChange={(e) => setEditedMovieTitle(e.target.value)} 
                className="bg-black text-white px-3 py-2 w-full focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all font-vt text-xl"
              />
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase tracking-widest text-black/60 font-vt text-lg">Release Year</label>
              <input 
                type="number"
                value={editedYear} 
                onChange={(e) => setEditedYear(e.target.value)} 
                className="bg-white border-2 border-black px-3 py-2 w-full sm:w-1/3 focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all font-vt text-xl"
              />
            </div>
          </div>


        </div>
      )}

      {/* Generated Markdown & Save */}
      {markdown && (
        <div className="flex flex-col gap-6">
          <MarkdownPreview content={markdown} />
          
          <div className="brutal-card p-5 bg-fuchsia-300 flex flex-col gap-3">
            <Button 
              onClick={handleSave}
              isLoading={isSaving}
              disabled={saveStatus === "success"}
              className={saveStatus === "success" ? "!bg-green-400 !border-black" : "!bg-white"}
            >
              {saveStatus === "success" ? (
                <>
                  <CheckCircle2 size={18} strokeWidth={3} />
                  Saved
                </>
              ) : (
                <>
                  <Save size={18} strokeWidth={3} />
                  Save
                </>
              )}
            </Button>
            
            {saveStatus === "error" && (
              <p className="text-sm font-bold text-red-600 bg-white border-2 border-black p-2 flex items-center justify-center gap-1 mt-1">
                <AlertCircle size={16} strokeWidth={3} />
                Failed to save. Check your Apps Script URL.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
