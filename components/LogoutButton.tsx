"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";

export function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
      router.refresh();
    } catch (e) {
      console.error(e);
      setIsLoading(false);
    }
  };

  return (
    <motion.button
      onClick={handleLogout}
      disabled={isLoading}
      whileHover={{ scale: 1.1, rotate: -5 }}
      whileTap={{ scale: 0.9, rotate: 10 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
      className="w-10 h-10 brutal-btn bg-red-400 flex items-center justify-center text-black shrink-0 cursor-pointer"
      aria-label="Logout"
    >
      <LogOut size={20} strokeWidth={3} />
    </motion.button>
  );
}
