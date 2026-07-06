import { PrismaClient } from "@prisma/client";

import { PrismaNeon } from "@prisma/adapter-neon";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const adapter = new PrismaNeon({
    connectionString: process.env.DATABASE_URL as string,
  });

  return new PrismaClient({
    adapter,
    log: ["query"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();
// Reutiliza la instancia existente o crea una nueva

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  // Solo guarda en globalThis durante desarrollo
  // para evitar múltiples conexiones por los reinicios de Next.js
}
