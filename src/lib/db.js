import { PrismaClient } from "@prisma/client";

const globalForPrisma = global;

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {

    globalForPrisma.prisma = prisma;
    
    setInterval(async () => {
        await prisma.$queryRaw`SELECT 1`;
  }, 4 * 60 * 1000);
    }