/**
 * @id SRC-PRISMA-CLIENT
 * @description Prisma Client Singleton instance.
 */
import { PrismaClient } from '../generated/prisma';

const prismaClientSingleton = () => {
  return new PrismaClient(
    process.env.DATABASE_URL
      ? {
          datasourceUrl: process.env.DATABASE_URL,
        }
      : undefined,
  );
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;
