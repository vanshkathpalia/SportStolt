// lib/prismaClient.ts
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';

export function getPrisma(dbUrl: string) {
  return new PrismaClient({
    datasources: {
      db: { url: dbUrl },
    },
  }).$extends(withAccelerate());
}