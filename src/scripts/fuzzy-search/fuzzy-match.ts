import { levenshteinDistance } from '@/scripts/fuzzy-search/levenshtein-distance';

// configure for matching precision in %
const MIN_MATCH_THRESHOLD = 0.5; // words match for 50% or more

// Function splits search query into separate words, numbers and words containing numbers.
function splitSearchQuery(searchQuery: string): string[] {
  return searchQuery.split(/[^\p{L}\p{N}_]+/u).filter((str) => str.length > 0);
}

// Returns a boolean value indicating whether the product name matches the search query
export function isFuzzyMatch(search: string, name: string): boolean {
  const searchWords = splitSearchQuery(search.toLowerCase());
  const nameWords = splitSearchQuery(name.toLowerCase());

  if (searchWords.length < 1 || nameWords.length < 1) {
    return false;
  }

  let bestDistance: number = 0;
  for (const searchWord of searchWords) {
    let currentBest: number = Number.MAX_VALUE;

    for (const nameWord of nameWords) {
      currentBest = Math.min(
        levenshteinDistance(searchWord, nameWord),
        currentBest,
      );
    }

    bestDistance += currentBest;
  }

  // join words back into one string without unwanted characters
  const fullQuery = searchWords.join();

  return bestDistance / fullQuery.length < 1 - MIN_MATCH_THRESHOLD;
}
