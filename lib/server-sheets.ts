import { ArchiveEntry } from "./types";

const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL;

export async function getEntriesServer(): Promise<ArchiveEntry[]> {
  if (!APPS_SCRIPT_URL) {
    throw new Error("APPS_SCRIPT_URL not set");
  }

  try {
    const res = await fetch(`${APPS_SCRIPT_URL}?action=entries`, {
      next: { tags: ["entries"], revalidate: 60 },
    });
    
    if (!res.ok) throw new Error("Failed to fetch from Google Apps Script");
    
    const data = await res.json();
    return data.data?.entries || [];
  } catch (error) {
    console.error("Error fetching entries server-side:", error);
    return [];
  }
}
