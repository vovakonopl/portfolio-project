import { expect, test } from 'vitest';
import { levenshteinDistance } from '@/scripts/fuzzy-search/levenshtein-distance';

test('Empty strings', () => {
  expect(levenshteinDistance('', '')).toBe(0);
});

test('Similar words', () => {
  expect(levenshteinDistance('apple', 'apple')).toBe(0);
});

test('Single insertion', () => {
  expect(levenshteinDistance('aple', 'apple')).toBe(1);
});

test('Single deletion', () => {
  expect(levenshteinDistance('appple', 'apple')).toBe(1);
});

test('Single replacement', () => {
  expect(levenshteinDistance('aprle', 'apple')).toBe(1);
});

test('Empty string to "apple"', () => {
  expect(levenshteinDistance('', 'apple')).toBe(5);
});

test('"apple" to "applesauce"', () => {
  expect(levenshteinDistance('apple', 'applesauce')).toBe(5);
});

test('"apple" to "alphabet"', () => {
  expect(levenshteinDistance('apple', 'alphabet')).toBe(5);
});

test('"apple" to "archer"', () => {
  expect(levenshteinDistance('apple', 'archer')).toBe(4);
});
