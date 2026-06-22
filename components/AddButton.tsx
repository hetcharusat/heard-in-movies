"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export function AddButton() {
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();

  const handleAddClick = () => {
    setIsNavigating(true);
    // Give time for the circle to expand
    setTimeout(() => {
      router.push("/add");
    }, 250);
  };

  return (
    <>
      <button 
        onClick={handleAddClick}
        className="brutal-btn w-10 h-10 flex items-center justify-center bg-cyan-400 relative z-20"
        aria-label="Add new entry"
      >
        <Plus size={24} strokeWidth={3} />
      </button>

      <AnimatePresence>
        {isNavigating && (
          <motion.div 
            initial={{ clipPath: "circle(0px at 100% 0%)" }} 
            animate={{ clipPath: "circle(150% at 100% 0%)" }} 
            exit={{ clipPath: "circle(0px at 100% 0%)" }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="fixed inset-0 bg-cyan-400 z-50 pointer-events-none" 
            style={{
              // Center the origin of the circle around where the button normally is
              transformOrigin: "top right"
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
