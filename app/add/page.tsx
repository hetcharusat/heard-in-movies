import { EntryForm } from "@/components/EntryForm";
import { LogoutButton } from "@/components/LogoutButton";
import { HomeButton, TableButton } from "@/components/HeaderActions";
import { getEntriesServer } from "@/lib/server-sheets";
import { PageTransition } from "@/components/PageTransition";

export default async function AddPage() {
  const entries = await getEntriesServer();
  const nextNumber = entries.length + 1;

  return (
    <PageTransition>
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
          <TableButton />
          <HomeButton />
        </div>
      </header>

      <EntryForm initialNextNumber={nextNumber} />
    </PageTransition>
  );
}
