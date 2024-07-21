import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { UserJSON, WebhookEvent } from '@clerk/nextjs/server';
import db from '@/lib/db';
import { userCache } from '@/scripts/cache/user';

class UserData {
  id: string;
  firstName: string;
  lastName: string;
  username: string | null;
  email: string;

  constructor(data: UserJSON) {
    this.id = data.id;
    this.firstName = data.first_name!;
    this.lastName = data.last_name!;
    this.email = data.email_addresses[0].email_address;
    this.username = data.username;
  }
}

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      'Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local',
    );
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400,
    });
  }

  // listen events
  const eventType = evt.type;

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const userData: UserData = new UserData(evt.data);

    // set/update user to db
    const user = await db.user.upsert({
      where: {
        id: userData.id,
      },
      create: userData,
      update: userData,
      include: {
        additionalContacts: true,
      },
    });

    // set/update user to cache
    await userCache.set(user);
  }

  if (eventType === 'user.deleted') {
    if (!evt.data.id) return;

    await db.user.delete({
      where: {
        id: evt.data.id,
      },
    });
    userCache.del(evt.data.id);
  }

  return new Response('', { status: 200 });
}
