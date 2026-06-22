export interface Song {
  id: string;
  title: string;
  artist: string;
  url: string;        // YouTube Music link
  videoId: string;
}

export interface Movie {
  id: number;
  title: string;
  year: number;
  posterPath?: string;
}

export interface ArchiveEntry {
  id: string;
  song: string;
  artist: string;
  movie: string;
  year: number;
  link: string;
  dateAdded: string;
}
