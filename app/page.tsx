import Link from "next/link";
import { getEntriesServer } from "@/lib/server-sheets";
import { ArchiveTable } from "@/components/ArchiveTable";
import { ShareButton } from "@/components/ShareButton";
import { Plus } from "lucide-react";

export const revalidate = 3600;

export default async function HomePage() {
  const entries = await getEntriesServer();

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 pt-2 pb-6 min-h-[100dvh]">
      <header className="mb-6 flex items-start justify-between gap-4">
        <div className="flex flex-col flex-1">
          <h1 className="font-press text-2xl md:text-3xl uppercase tracking-tighter leading-snug text-black mt-2">
            I HEARD IN<br />MOVIES
          </h1>
          <p className="font-vt text-xl md:text-2xl font-bold mt-3 text-black/80">
            {entries.length} {entries.length === 1 ? "song" : "songs"} collected.
          </p>
        </div>
        
        <div className="flex items-center gap-2 shrink-0">
          <ShareButton />
          <Link 
            href="/add"
            className="brutal-btn w-10 h-10 flex items-center justify-center bg-cyan-400"
            aria-label="Add new entry"
          >
            <Plus size={24} strokeWidth={3} />
          </Link>
        </div>
      </header>

      <ArchiveTable initialEntries={entries} />
    </div>
  );
}
