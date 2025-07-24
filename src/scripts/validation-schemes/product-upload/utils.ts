import { z } from 'zod';
import { zodInvalidFileCharsRegexEntry } from '@/scripts/validation-schemes/invalid-file-chars-regex';

// Creates schemes for group/option/service names
export function createNameScheme(
  nameType: 'group' | 'option' | 'service',
  maxLength: number,
) {
  const capitalised: string = nameType[0].toUpperCase() + nameType.slice(1);
  return z
    .string({ message: 'Must be a string.' })
    .min(1, { message: `${capitalised} name required.` })
    .max(maxLength, {
      message: `Maximum length of ${nameType} name is ${maxLength} characters.`,
    })
    .regex(...zodInvalidFileCharsRegexEntry);
}

// Verifies that every key of the map equals to specified property of the stored object
export function refineMapKeys<T>(
  map: Map<string, T>,
  ctx: z.RefinementCtx,
  objectKey: keyof T,
) {
  for (const key of map.keys()) {
    if (key === map.get(key)![objectKey]) continue;

    ctx.addIssue({
      code: 'custom',
      message: 'Map keys must match the corresponding option names.',
      path: [key],
    });
  }
}
