import { string, z } from 'zod';

const nameString = z
  .string({ message: 'Must be a string.' })
  .min(2, 'Must be longer than 2 chars.')
  .max(35, 'Must be shorter than 35 chars.')
  .regex(/^[a-zA-Z]+$/, {
    message: 'Name can only contain letters',
  })
  .refine((value: string) => !value.includes(' '), 'You can not use spaces.');

export const userAboutScheme = z.object({
  firstName: nameString,
  lastName: nameString,
  username: z
    .string({ message: 'Must be a string.' })
    .max(20, 'Must be shorter than 20 chars.')
    .refine(
      (value: string) => value.length === 0 || value.length >= 4,
      'Must be longer than 4 chars (or can be empty).',
    )
    .refine(
      (value: string | undefined) => !value || !value.includes(' '),
      'You can not use spaces.',
    ),
});

export type TUserAboutScheme = z.infer<typeof userAboutScheme>;
