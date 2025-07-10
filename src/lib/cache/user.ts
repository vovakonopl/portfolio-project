import { redisClient } from '@/lib/redis';
import { UserWithContacts } from '@/types/user';
import db from '@/lib/db';

const DEFAULT_EXPIRE_TIME = 3600;

async function set(user: UserWithContacts): Promise<void> {
  await redisClient.set(`user:${user.id}`, JSON.stringify(user), {
    EX: DEFAULT_EXPIRE_TIME,
  });
}

async function get(userId: string): Promise<string> {
  const userJSON: string | null = await redisClient.get(`user:${userId}`);

  if (!userJSON) {
    // if the user wasn't found in cache => return data from db and set it in cache
    const user: UserWithContacts | null = await db.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        additionalContacts: true,
      },
    });

    if (!user) {
      throw new Error('User does not exist.');
    }

    await set(user);

    return JSON.stringify(user);
  }

  return userJSON;
}

async function del(userId: string): Promise<void> {
  await redisClient.del(`user:${userId}`);
}

export const userCache = {
  set,
  get,
  del,
};
