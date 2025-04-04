import { PrismaClient } from '@prisma/client';
import { createClient } from 'redis';

export const database = new PrismaClient();

export const redis = createClient();

export type RedisType = typeof redis;

redis.connect();
