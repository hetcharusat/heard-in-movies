"use client";

import { motion } from "framer-motion";

export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.7, 
        ease: [0.16, 1, 0.3, 1] // Butter-smooth easeOutExpo
      }}
      className="flex flex-col h-full pt-2 pb-6 min-h-[100dvh]"
    >
      {children}
    </motion.div>
  );
}
