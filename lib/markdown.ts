interface MarkdownData {
  number?: number;
  songTitle: string;
  artist: string;
  url: string;
  movieTitle: string;
  year: string | number;
}

/**
 * Generates markdown exactly in the requested format:
 * 3. [Where Is My Mind? **%grey% Pixies %%**](https://music.youtube.com/watch?v=49FB9hhoO6c) - %gold%Fight Club (1999)%%
 */
export function generateMarkdown({
  number = 1,
  songTitle,
  artist,
  url,
  movieTitle,
  year,
}: MarkdownData): string {
  // Ensure the formatting matches exactly
  return `${number}. [${songTitle} **%grey% ${artist} %%**](${url}) - %gold%${movieTitle} (${year})%%`;
}
