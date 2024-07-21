import { Prisma } from '@prisma/client';

export type UserWithContacts = Prisma.UserGetPayload<{
  include: { additionalContacts: true };
}>;
