import { ArchiveEntry } from "./types";

export async function fetchStats(): Promise<{ totalEntries: number }> {
  try {
    const res = await fetch(`/api/sheets?action=stats`, {
      cache: "no-store",
    });
    
    if (!res.ok) throw new Error("Failed to fetch stats");
    
    const json = await res.json();
    return { totalEntries: json.data?.totalEntries || 0 };
  } catch (error) {
    console.error("Error fetching stats:", error);
    return { totalEntries: 0 };
  }
}

export async function fetchEntries(): Promise<ArchiveEntry[]> {
  try {
    const res = await fetch(`/api/sheets?action=entries`, {
      cache: "no-store",
    });
    
    if (!res.ok) throw new Error("Failed to fetch entries");
    
    const json = await res.json();
    return json.data?.entries || [];
  } catch (error) {
    console.error("Error fetching entries:", error);
    return [];
  }
}

export async function saveEntry(entry: Partial<ArchiveEntry>): Promise<boolean> {
  try {
    const res = await fetch('/api/sheets', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(entry),
    });

    const json = await res.json();
    return json.status === "success";
  } catch (error) {
    console.error("Error saving entry:", error);
    return false;
  }
}
