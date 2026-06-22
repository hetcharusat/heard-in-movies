"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className="w-12 h-12 brutal-btn bg-red-400 flex items-center justify-center text-black shrink-0"
      aria-label="Logout"
    >
      <LogOut size={24} strokeWidth={3} />
    </button>
  );
}
