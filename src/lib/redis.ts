import { createClient } from 'redis';

export const redisClient = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_SOCKET_HOST,
    port: +process.env.REDIS_SOCKET_PORT!,
  },
}).on('error', (err) => console.log('Redis client error:', err));

if (!redisClient.isOpen) {
  redisClient.connect();
}
