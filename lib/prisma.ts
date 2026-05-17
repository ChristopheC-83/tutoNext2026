//  on génère un singleton de connexion prisma

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ log: ["query"] });

if (process.env.NEDE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
