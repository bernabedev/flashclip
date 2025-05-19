import { PrismaClient } from "./../generated/prisma/index";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "Please provide a DATABASE_URL in the environment variables."
  );
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient;
};

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
