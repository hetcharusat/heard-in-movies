import { EntryForm } from "@/components/EntryForm";
import { LogoutButton } from "@/components/LogoutButton";
import Link from "next/link";
import { Home, Table } from "lucide-react";
import { getEntriesServer } from "@/lib/server-sheets";

export default async function AddPage() {
  const entries = await getEntriesServer();
  const nextNumber = entries.length + 1;

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300 pt-2 pb-6 min-h-[100dvh]">
      <header className="mb-6 flex items-start justify-between gap-4">
        <div className="flex flex-col flex-1 mt-2">
          <h1 className="font-press text-[20px] md:text-3xl uppercase tracking-tighter text-black leading-snug">
            ADD<br/>ENTRY
          </h1>
          <p className="font-vt text-lg md:text-2xl font-bold text-black/80 mt-2">
            Find a song and the movie you heard it in.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <LogoutButton />
          <a 
            href="https://docs.google.com/spreadsheets/d/1scVq_Wmz_z0g8qhVMtbRDX-4AM4Ci57RmdO6cDgQrIo/edit?usp=sharing"
            target="_blank"
            rel="noreferrer"
            className="w-10 h-10 brutal-btn bg-green-400 flex items-center justify-center text-black"
            title="Open Google Sheet"
          >
            <Table size={20} strokeWidth={3} />
          </a>
          <Link
            href="/"
            className="w-10 h-10 brutal-btn bg-cyan-400 flex items-center justify-center text-black"
            aria-label="Back to List"
          >
            <Home size={20} strokeWidth={3} />
          </Link>
        </div>
      </header>

      <EntryForm initialNextNumber={nextNumber} />
    </div>
  );
}
