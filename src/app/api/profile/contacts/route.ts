import db from '@/lib/db';
import { userCache } from '@/lib/cache/user';
import { UserWithContacts } from '@/types/user';
import { auth } from '@clerk/nextjs/server';
import { Contact } from '@prisma/client';

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return new Response('User not logged in', { status: 403 });
  }

  const { body, url }: { body: string; url: string | null } = await req.json();

  const contact: Contact = await db.contact.create({
    data: {
      userId,
      body,
      url,
    },
  });

  // update cache
  const userJSON: string = await userCache.get(userId);
  const user: UserWithContacts = JSON.parse(userJSON);
  user.additionalContacts.push(contact);
  userCache.set(user);

  return new Response(JSON.stringify(contact), { status: 200 });
}

export async function DELETE(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return new Response('User not logged in', { status: 403 });
  }

  const { id }: { id: string } = await req.json();

  await db.contact.delete({
    where: {
      id,
    },
  });

  // update cache
  const userJSON: string = await userCache.get(userId);
  const user: UserWithContacts = JSON.parse(userJSON);
  user.additionalContacts = user.additionalContacts.filter(
    (contact: Contact) => contact.id !== id,
  );
  userCache.set(user);

  return new Response('Contact deleted', { status: 200 });
}
