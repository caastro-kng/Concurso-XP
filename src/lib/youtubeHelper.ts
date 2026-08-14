// Helper to generate unbreakable YouTube Search URLs with terms joined by '+'
export function buildYouTubeSearchQueryUrl(terms: string): string {
  if (!terms) return "https://www.youtube.com";
  
  const clean = terms
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents for clean search
    .replace(/[^\w\s]/gi, " ")       // Remove special characters
    .replace(/\s+/g, "+");           // Replace spaces with +
  
  return `https://www.youtube.com/results?search_query=${clean}`;
}

export function getYouTubeSearchUrl(query: string): string {
  return buildYouTubeSearchQueryUrl(query);
}

export function buildTopicSearchUrl(disciplinaNome: string, topicoNome: string, concursoNome?: string): string {
  const query = `${disciplinaNome} ${topicoNome} ${concursoNome || ''}`.trim();
  return buildYouTubeSearchQueryUrl(query);
}

export function extractYouTubeId(urlOrSearch: string | undefined): string | null {
  if (!urlOrSearch) return null;
  
  const trimmed = urlOrSearch.trim();
  const match = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/i
  );
  
  if (match && match[1]) {
    return match[1];
  }
  
  return null;
}

export function getYouTubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

export function getYouTubeWatchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}


