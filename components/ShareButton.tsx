"use client";

import { Share2, Check } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

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
    <motion.button 
      onClick={handleShare}
      whileHover={{ scale: 1.1, rotate: -5 }}
      whileTap={{ scale: 0.9, rotate: 10 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
      className="brutal-btn bg-white w-10 h-10 flex items-center justify-center hover:bg-yellow-300 cursor-pointer transition-colors shrink-0"
      title="Share Website"
    >
      {copied ? <Check size={18} strokeWidth={3} /> : <Share2 size={18} strokeWidth={3} />}
    </motion.button>
  );
}
