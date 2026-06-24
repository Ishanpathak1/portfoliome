import { cert, getApps, initializeApp, applicationDefault, type App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import type { NextRequest } from 'next/server';

export type AuthenticatedUser = {
  uid: string;
  email?: string;
  name?: string;
  isAdmin: boolean;
};

export class AuthError extends Error {
  status = 401;

  constructor(message = 'Unauthorized') {
    super(message);
    this.name = 'AuthError';
  }
}

function getAdminEmails(): Set<string> {
  return new Set(
    (process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || '')
      .split(',')
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean)
  );
}

function getFirebaseAdminApp(): App {
  const existing = getApps()[0];
  if (existing) return existing;

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (serviceAccountJson) {
    return initializeApp({
      credential: cert(JSON.parse(serviceAccountJson)),
    });
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (projectId && clientEmail && privateKey) {
    return initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
    });
  }

  return initializeApp({
    credential: applicationDefault(),
    projectId,
  });
}

export function getBearerToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  const token = authHeader.slice('Bearer '.length).trim();
  return token || null;
}

export async function verifyRequestUser(request: NextRequest): Promise<AuthenticatedUser | null> {
  const token = getBearerToken(request);
  if (!token) return null;

  try {
    const decoded = await getAuth(getFirebaseAdminApp()).verifyIdToken(token, true);
    const email = decoded.email?.toLowerCase();
    const adminEmails = getAdminEmails();

    return {
      uid: decoded.uid,
      email,
      name: decoded.name,
      isAdmin: decoded.admin === true || (!!email && adminEmails.has(email)),
    };
  } catch (error) {
    console.warn('Firebase token verification failed');
    return null;
  }
}

export async function requireUser(request: NextRequest): Promise<AuthenticatedUser> {
  const user = await verifyRequestUser(request);
  if (!user) throw new AuthError();
  return user;
}

export async function requireAdmin(request: NextRequest): Promise<AuthenticatedUser> {
  const user = await requireUser(request);
  if (!user.isAdmin) throw new AuthError();
  return user;
}
