"use client";

import { Share2, Check } from "lucide-react";
import { useState } from "react";

export function ShareButton() {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  return (
    <button 
      onClick={handleShare}
      className="brutal-btn bg-white w-10 h-10 flex items-center justify-center hover:bg-yellow-300 transition-colors shrink-0"
      title="Share Website"
    >
      {copied ? <Check size={18} strokeWidth={3} /> : <Share2 size={18} strokeWidth={3} />}
    </button>
  );
}
