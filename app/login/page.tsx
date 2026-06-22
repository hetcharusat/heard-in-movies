"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Lock, LogIn, AlertCircle, Home } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Redirect back to where they came from, or /add
        const from = searchParams.get("from") || "/add";
        router.push(from);
        router.refresh(); // Force refresh to update middleware state
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col h-[70vh] items-center justify-center animate-in fade-in duration-500">
      <Link
        href="/"
        className="absolute top-0 right-0 w-12 h-12 brutal-btn bg-cyan-400 flex items-center justify-center text-black shrink-0"
        aria-label="Back to List"
      >
        <Home size={24} strokeWidth={3} />
      </Link>
      <div className="w-full max-w-sm brutal-card bg-yellow-300 p-8 flex flex-col items-center gap-6">
        <div className="w-16 h-16 bg-white border-4 border-black flex items-center justify-center text-black mb-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <Lock size={32} strokeWidth={3} />
        </div>
        
        <div className="text-center">
          <h1 className="text-3xl font-black uppercase tracking-tighter text-black mb-2">Restricted Area</h1>
          <p className="text-sm font-bold text-black border-l-4 border-black pl-2 text-left">
            Only the administrator can add new entries.
          </p>
        </div>

        <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
          <Input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            autoFocus
          />
          
          {error && (
            <p className="text-sm font-bold text-red-600 bg-white border-2 border-black p-2 flex items-center justify-center gap-1">
              <AlertCircle size={16} strokeWidth={3} />
              {error}
            </p>
          )}

          <Button type="submit" isLoading={isLoading} className="w-full mt-2">
            {!isLoading && <LogIn size={20} strokeWidth={3} />}
            Authenticate
          </Button>
        </form>
      </div>
    </div>
  );
}
