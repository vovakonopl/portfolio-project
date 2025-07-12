import { expect, test } from 'vitest';
import { isFuzzyMatch } from '@/scripts/fuzzy-search/fuzzy-match';

// =-=-=-=-=-=-=-=-=-=-=-= Empty string =-=-=-=-=-=-=-=-=-=-=-=
test('Empty strings', () => {
  expect(isFuzzyMatch('', '')).toBe(false);
});
test('Empty search', () => {
  expect(isFuzzyMatch('', 'product name')).toBe(false);
});
test('Empty product name', () => {
  expect(isFuzzyMatch('search', '')).toBe(false);
});
test('Search query does not contain any words', () => {
  expect(
    isFuzzyMatch('-; =: ][%!@#$%^&*()_+-= |\\/\'"`.,><', 'product name'),
  ).toBe(false);
});

// =-=-=-=-=-=-= Product name contains search query =-=-=-=-=-=-=
test('Exact match', () => {
  expect(isFuzzyMatch('apple', 'Apple')).toBe(true);
});
test('Exact match', () => {
  expect(isFuzzyMatch('red shirt', 'Red Shirt')).toBe(true);
});
test('Product name contains search query and other words', () => {
  expect(isFuzzyMatch('iphone 15', 'brand new black iPhone 15 Pro')).toBe(true);
});
test('Search query should be separated to contain same words, as product', () => {
  expect(isFuzzyMatch('Product-id_33 ', 'product id 33')).toBe(true);
});

// =-=-= Product name contains the search query but with different order =-=-=
test('Different order', () => {
  expect(isFuzzyMatch('shirt red', 'Red Shirt')).toBe(true);
});
test('Different order', () => {
  expect(isFuzzyMatch('desk office', 'Office Desk')).toBe(true);
});
test('Different order and extra words in product name', () => {
  expect(
    isFuzzyMatch('phone case black', 'new black phone case for iphone'),
  ).toBe(true);
});
test('Different order and extra words in search query', () => {
  expect(isFuzzyMatch('phone case black', 'phone case')).toBe(true);
});

// =-=-=-=-=-=-=-=-= short matching queries and names =-=-=-=-=-=-=-=-=
test('Have similar words', () => {
  expect(isFuzzyMatch('red shirt', 'Blue Shirt')).toBe(true);
});
test('Have similar words', () => {
  expect(isFuzzyMatch('blue phone', 'black iphone')).toBe(true);
});
test('Have similar words', () => {
  expect(isFuzzyMatch('Garry-Potter cool bok', 'Harry Potter book')).toBe(true);
});

// =-=-=-=-=-=-=-=-= Long matching queries and names =-=-=-=-=-=-=-=-=
test('Long matching strings', () => {
  expect(
    isFuzzyMatch(
      'buy new keyboard for gaming with no wire',
      'Logitech G515 Lightspeed TKL Low Profile Wireless Gaming Keyboard',
    ),
  ).toBe(true);
});
test('Long matching strings', () => {
  expect(
    isFuzzyMatch(
      'laptop for gaming with rtx',
      'MSI GF63 Gaming Laptop 2023 | 15.6" FHD 144Hz Display | ' +
        '10-Core 12th Intel i7-12650H Nvidia RTX 4050 | 6GB 64GB DDR4 2TB M.2 SSD',
    ),
  ).toBe(true);
});
test('Long matching strings', () => {
  expect(
    isFuzzyMatch(
      'apple makbook notebook',
      '2025 MacBook Air 13-inch Laptop with M4 chip, 24GB Unified Memory, 1TB SSD Storage - Midnight\n',
    ),
  ).toBe(true);
});

// =-=-=-=-=-=-=-=-=-=-=-= Shouldn't match =-=-=-=-=-=-=-=-=-=-=-=
test('Have similar words, but have different context', () => {
  expect(isFuzzyMatch('bottles for orange juice', 'Apple Juice')).toBe(false);
});
test('Have similar words, but have different context', () => {
  expect(isFuzzyMatch('shirt and black socks', 'short blue leader')).toBe(
    false,
  );
});
test('Have similar words, but have different context', () => {
  expect(isFuzzyMatch('wireless white earphones', 'Wired mobile charger')).toBe(
    false,
  );
});
