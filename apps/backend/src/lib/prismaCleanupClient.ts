// lib/prismaCleanupClient.ts
import { PrismaClient as EdgePrismaClient } from '@prisma/client/edge';
import { PrismaClient as NodePrismaClient, PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

export function getPrismaCleanup(dbUrl: string) {
  if (process.env.NODE_ENV === 'development') {
    return new NodePrismaClient({
      datasources: {
        db: { url: dbUrl },
      },
    });
  }

  return new EdgePrismaClient({
    datasources: {
      db: { url: dbUrl },
    },
  }).$extends(withAccelerate()) as unknown as PrismaClient;
}

export type PrismaCleanupClient = ReturnType<typeof getPrismaCleanup>;
