import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

// Learn more about instantiating PrismaClient in Next.js here: https://www.prisma.io/docs/data-platform/accelerate/getting-started

const prismaClientSingleton = () => {
  return new PrismaClient().$extends(withAccelerate());
};

const globalForPrisma = global as typeof global & {
  db?: ReturnType<typeof prismaClientSingleton>;
};

const db = globalForPrisma.db ?? prismaClientSingleton();
if (process.env.NODE_ENV !== 'production') globalForPrisma.db = db;

export { db };
