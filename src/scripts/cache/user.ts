'use server';

import { redisClient } from '@/lib/redis';
import { User } from '@prisma/client';
import db from '@/lib/db';

const DEFAULT_EXPIRE_TIME = 3600;

export async function setUser(user: User): Promise<void> {
  await redisClient.set(`user:${user.id}`, JSON.stringify(user), {
    EX: DEFAULT_EXPIRE_TIME,
  });
}

export async function getUser(userId: string): Promise<string> {
  const userJSON: string | null = await redisClient.get(`user:${userId}`);

  if (!userJSON) {
    // if user wasn't found in cache => return data from db and set it in cache
    const user: User | null = await db.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new Error('User does not exist.');
    }

    await setUser(user);

    return JSON.stringify(user);
  }

  return userJSON;
}

export async function updateUser(user: Partial<User>): Promise<void> {
  // const userJSON: string | null = await redisClient.get(`user:${userId}`);
}
