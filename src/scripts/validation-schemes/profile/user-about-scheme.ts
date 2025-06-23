import { z } from 'zod';

const nameString = z
  .string({ message: 'Must be a string.' })
  .min(2, 'Minimum 2 characters.')
  .max(35, 'Maximum 35 characters.')
  .regex(/^[a-zA-Z]+$/, {
    message: 'Name can only contain letters',
  })
  .refine((value: string) => !value.includes(' '), 'You can not use spaces.')
  .transform(
    (str: string) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase(),
  );

export const userAboutScheme = z.object({
  firstName: nameString,
  lastName: nameString,
  username: z
    .string({ message: 'Must be a string.' })
    .max(35, 'Maximum 35 characters.')
    .refine(
      (value: string) => value.length === 0 || value.length >= 4,
      'Minimum 4 characters (or can be empty).',
    )
    .refine(
      (value: string | undefined) => !value || !value.includes(' '),
      'You can not use spaces.',
    )
    .transform((str: string) => str.toLowerCase()),
  bio: z
    .string()
    .max(200, 'Must be shorter than 200 chars.')
    .optional()
    .refine(
      (text: string | undefined) => !text || text.split('\n').length <= 4,
      'Must contain 4 rows at most.',
    ),
});

export type TUserAboutScheme = z.infer<typeof userAboutScheme>;
