import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { getPrisma } from '~/lib/prismaClient';

export const getUserPreferences = async (dburl: string, userId: number) => {

  const prisma = getPrisma(dburl);

  return prisma.userPreference.findUnique({
    where: { userId }
  });
};

export const setUserPreferences = async (dburl: string, userId: number, sports: string[], locations: string[]) => {

  const prisma = getPrisma(dburl);

  console.log('Received:', { sports, locations });

  return prisma.userPreference.upsert({
    where: { userId },
    update: { preferredSports: sports, preferredLocations: locations },
    create: {
      userId,
      preferredSports: sports,
      preferredLocations: locations
    }
  });
};
