export function levenshteinDistance(
  str1: string,
  str2: string,
  m: number, // idx for str1
  n: number, // idx for str2
): number {
  if (m === 0) return n; // end of str1
  if (n === 0) return m; // end of str2

  // no operations required
  if (str1[m - 1] === str2[n - 1]) {
    return levenshteinDistance(str1, str2, m - 1, n - 1);
  }

  return (
    1 +
    Math.min(
      levenshteinDistance(str1, str2, m, n - 1), // insertion
      levenshteinDistance(str1, str2, m - 1, n), // deletion
      levenshteinDistance(str1, str2, m - 1, n - 1), // replacement
    )
  );
}
