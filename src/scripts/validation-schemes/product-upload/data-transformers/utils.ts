export const formDataKey: string = 'data';

const separator: string = '|';

export function mergeStrings(...strings: string[]): string {
  if (strings.length === 0) return '';
  if (strings.some((str) => str.includes(separator))) {
    throw new Error(`Strings must not contain the separator "${separator}".`);
  }

  let result: string = strings[0];
  for (let i = 1; i < strings.length; i++) {
    result += separator + strings[i];
  }

  return result;
}

type TKeys<T extends Record<string, any>> = Record<keyof T, keyof T>;

export function getKeys<T extends Record<string, any>>(
  obj: T,
): Readonly<TKeys<T>> {
  return Object.fromEntries(
    Object.keys(obj).map((key) => [key, key]),
  ) as TKeys<T>;
}
