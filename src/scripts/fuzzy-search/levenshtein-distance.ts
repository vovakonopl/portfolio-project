function levenshteinDistanceRecurse(
  str1: string,
  str2: string,
  m: number, // idx for str1
  n: number, // idx for str2
): number {
  if (m === 0) return n; // end of str1
  if (n === 0) return m; // end of str2

  // no operations required
  if (str1[m - 1] === str2[n - 1]) {
    return levenshteinDistanceRecurse(str1, str2, m - 1, n - 1);
  }

  return (
    1 +
    Math.min(
      levenshteinDistanceRecurse(str1, str2, m, n - 1), // insertion
      levenshteinDistanceRecurse(str1, str2, m - 1, n), // deletion
      levenshteinDistanceRecurse(str1, str2, m - 1, n - 1), // replacement
    )
  );
}

// Note: case-sensitive
export function levenshteinDistance(str1: string, str2: string) {
  return levenshteinDistanceRecurse(str1, str2, str1.length, str2.length);
}
