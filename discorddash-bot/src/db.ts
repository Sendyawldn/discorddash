// Assuming we run from the bot directory, we import the Prisma Client generated in the web workspace
import { PrismaClient } from '../../discorddash-web/node_modules/@prisma/client/index.js';

// Prevent multiple instances of Prisma Client in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
