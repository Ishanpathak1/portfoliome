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
      // Optimize connection pooling
      __internal: {
        engine: {
          connectionLimit: 5, // Reduce connection limit
          pool: {
            min: 0,
            max: 5, // Maximum 5 connections
            acquireTimeoutMillis: 5000, // 5 second timeout
            createTimeoutMillis: 5000,
            destroyTimeoutMillis: 5000,
            idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
            reapIntervalMillis: 1000,
            createRetryIntervalMillis: 100,
          },
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
    // Production connection pooling
    __internal: {
      engine: {
        connectionLimit: 10,
        pool: {
          min: 2,
          max: 10,
          acquireTimeoutMillis: 10000,
          createTimeoutMillis: 10000,
          destroyTimeoutMillis: 10000,
          idleTimeoutMillis: 60000,
          reapIntervalMillis: 1000,
          createRetryIntervalMillis: 100,
        },
      },
    },
  });
}

export { prisma }; 