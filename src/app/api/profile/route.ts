import db from '@/lib/db';
import { userCache } from '@/scripts/cache/user';
import { adjustContactArrays } from '@/scripts/adjust-contact-arrays';
import { auth } from '@clerk/nextjs/server';
import { User } from '@prisma/client';
import { UserWithContacts } from '@/types/user';

export const revalidate = 0;

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return new Response('User not logged in', { status: 403 });
  }

  try {
    const user: string = await userCache.get(userId);
    return new Response(user, { status: 200 });
  } catch {
    return new Response('User do not exist', { status: 404 });
  }
}

export async function PATCH(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return new Response('User not logged in', { status: 403 });
  }

  const data: Partial<User> = await req.json();
  // in case extra data was added => cut it
  adjustContactArrays(data);

  const user: UserWithContacts = await db.user.update({
    where: {
      id: userId,
    },
    data: data,
    include: {
      additionalContacts: true,
    },
  });
  await userCache.set(user);

  return new Response('Profile updated', { status: 200 });
}
