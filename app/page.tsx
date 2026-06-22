import { getEntriesServer } from "@/lib/server-sheets";
import { ArchiveTable } from "@/components/ArchiveTable";
import { ShareButton } from "@/components/ShareButton";
import { AddButton } from "@/components/HeaderActions";
import { PageTransition } from "@/components/PageTransition";

export const revalidate = 3600;

export default async function HomePage() {
  const entries = await getEntriesServer();

  return (
    <PageTransition>
      <header className="mb-6 flex items-start justify-between gap-4">
        <div className="flex flex-col flex-1">
          <h1 className="font-press text-[20px] md:text-3xl uppercase tracking-tighter leading-snug text-black mt-2">
            I Heard In <br/> Movies
          </h1>
          <p className="font-vt text-lg md:text-xl text-black/80 uppercase tracking-widest mt-1">
            {entries.length} songs archived
          </p>
        </div>
        
        <div className="flex items-center gap-2 shrink-0">
          <ShareButton />
          <AddButton />
        </div>
      </header>

      <ArchiveTable initialEntries={entries} />
    </PageTransition>
  );
}
