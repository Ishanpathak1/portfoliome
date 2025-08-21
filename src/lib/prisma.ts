import { PrismaClient } from '@prisma/client';

// Allow disabling DB access in local development to avoid noisy Prisma errors
const isDbDisabled = process.env.DISABLE_DB === 'true';
export const isDbEnabled = !isDbDisabled;

// Global variable to store the Prisma client instance
let prismaInstance: PrismaClient | undefined;

if (isDbDisabled) {
  // Do not initialize Prisma at all when DB is disabled
  prismaInstance = undefined;
} else if (process.env.NODE_ENV === 'development') {
  // In development, use a global variable to prevent multiple instances
  if (!(global as any).prisma) {
    (global as any).prisma = new PrismaClient({
      log: ['query', 'info', 'warn', 'error'],
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });
  }
  prismaInstance = (global as any).prisma;
} else {
  // In production, create a new instance
  prismaInstance = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });
}

export const prisma = prismaInstance;

export function requirePrisma(): PrismaClient {
  if (!prismaInstance) {
    throw new Error('Database is disabled (set DISABLE_DB=false) or Prisma not initialized.');
  }
  return prismaInstance;
}