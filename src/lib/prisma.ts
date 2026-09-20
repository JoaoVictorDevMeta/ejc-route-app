import { db } from "@/prisma/db";

const globalForPrisma = globalThis as unknown as {
  prisma: typeof db | undefined;
};

export const prisma = globalForPrisma.prisma ?? db;

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export type { Contract } from "@/prisma/contract";