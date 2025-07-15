import { PrismaClient } from '@prisma/client';

// Global variable to store the Prisma client instance
let prisma: PrismaClient;

// Check if we're in development mode
if (process.env.NODE_ENV === 'development') {
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
  prisma = (global as any).prisma;
} else {
  // In production, create a new instance
  prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });
}

export { prisma }; 