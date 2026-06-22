"use client";

import { useState } from "react";
import { Button } from "./ui/Button";
import { Copy, Check } from "lucide-react";

interface MarkdownPreviewProps {
  content: string;
}

export function MarkdownPreview({ content }: MarkdownPreviewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!content) return;
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="relative w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="brutal-card bg-black text-white p-4 relative group">
        <pre className="text-sm font-mono whitespace-pre-wrap break-words pr-8">
          {content || "Your markdown will appear here..."}
        </pre>
        
        {content && (
          <button 
            onClick={handleCopy}
            className="absolute top-3 right-3 text-white/50 hover:text-white transition-colors p-1"
            title="Copy Markdown"
          >
            {copied ? <Check size={16} strokeWidth={3} className="text-green-400" /> : <Copy size={16} strokeWidth={3} />}
          </button>
        )}
      </div>
    </div>
  );
}
