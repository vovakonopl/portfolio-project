import { getUser } from '@/scripts/cache/user';
import { User, auth } from '@clerk/nextjs/server';

export const revalidate = 0;

export async function GET() {
  const { userId } = auth();

  if (!userId) {
    return new Response('User not logged in', { status: 403 });
  }

  try {
    const userJSON: string = await getUser(userId);
    const user: User = JSON.parse(userJSON);

    new Response(userJSON, { status: 200 });
    return Response.json(user);
  } catch {
    return new Response('User do not exist', { status: 404 });
  }
}
