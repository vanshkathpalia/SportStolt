// // lib/prisma.ts
// import { PrismaClient } from '@prisma/client';
// import { withAccelerate } from '@prisma/extension-accelerate';

// // Declare a type that matches the extended client
// const prismaBase = new PrismaClient();
// const prismaExtended = prismaBase.$extends(withAccelerate());

// // Store it globally with proper type
// const globalForPrisma = globalThis as unknown as {
//   prisma: typeof prismaExtended | undefined;
// };

// export const prisma = globalForPrisma.prisma ?? prismaExtended;

// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;


// // // lib/prisma.ts
// // import { PrismaClient } from '@prisma/client';
// // import { withAccelerate } from '@prisma/extension-accelerate';

// // const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

// // export const prisma =
// //   globalForPrisma.prisma ??
// //   new PrismaClient().$extends(withAccelerate());

// // if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
