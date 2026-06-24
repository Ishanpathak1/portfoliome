import { cert, getApps, initializeApp, applicationDefault, type App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import type { NextRequest } from 'next/server';
import { decodeProtectedHeader, importX509, jwtVerify, type JWTPayload } from 'jose';

export type AuthenticatedUser = {
  uid: string;
  email?: string;
  emailVerified: boolean;
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

type FirebaseJwtPayload = JWTPayload & {
  email?: string;
  email_verified?: boolean;
  name?: string;
  admin?: boolean;
  user_id?: string;
};

let publicCertCache: {
  certs: Record<string, string>;
  expiresAt: number;
} | null = null;

function getAdminEmails(): Set<string> {
  return new Set(
    (process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || '')
      .split(',')
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean)
  );
}

function hasFirebaseAdminCredentials(): boolean {
  return Boolean(
    process.env.FIREBASE_SERVICE_ACCOUNT_KEY ||
    (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) ||
    process.env.GOOGLE_APPLICATION_CREDENTIALS
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

  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
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

function getFirebaseProjectId(): string | undefined {
  return process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
}

async function getFirebasePublicCerts(): Promise<Record<string, string>> {
  if (publicCertCache && publicCertCache.expiresAt > Date.now()) {
    return publicCertCache.certs;
  }

  const response = await fetch('https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com');
  if (!response.ok) {
    throw new Error('Unable to fetch Firebase public certificates');
  }

  const cacheControl = response.headers.get('cache-control') || '';
  const maxAgeMatch = cacheControl.match(/max-age=(\d+)/);
  const maxAgeSeconds = maxAgeMatch ? Number(maxAgeMatch[1]) : 3600;
  const certs = await response.json() as Record<string, string>;

  publicCertCache = {
    certs,
    expiresAt: Date.now() + maxAgeSeconds * 1000,
  };

  return certs;
}

async function verifyFirebaseTokenWithPublicCerts(token: string): Promise<FirebaseJwtPayload> {
  const projectId = getFirebaseProjectId();
  if (!projectId) {
    throw new Error('Missing Firebase project id');
  }

  const header = decodeProtectedHeader(token);
  if (!header.kid) {
    throw new Error('Missing Firebase token key id');
  }

  const certs = await getFirebasePublicCerts();
  const cert = certs[header.kid];
  if (!cert) {
    throw new Error('Unknown Firebase token key id');
  }

  const key = await importX509(cert, 'RS256');
  const { payload } = await jwtVerify(token, key, {
    issuer: `https://securetoken.google.com/${projectId}`,
    audience: projectId,
    algorithms: ['RS256'],
  });

  const firebasePayload = payload as FirebaseJwtPayload;
  if (!firebasePayload.sub || firebasePayload.sub.length > 128) {
    throw new Error('Invalid Firebase token subject');
  }

  return {
    ...firebasePayload,
    user_id: firebasePayload.user_id || firebasePayload.sub,
  };
}

async function verifyFirebaseToken(token: string): Promise<FirebaseJwtPayload> {
  if (hasFirebaseAdminCredentials()) {
    try {
      const decoded = await getAuth(getFirebaseAdminApp()).verifyIdToken(token, true);
      return decoded as FirebaseJwtPayload;
    } catch (error) {
      console.warn('Firebase Admin token verification failed; falling back to public cert verification');
    }
  }

  return verifyFirebaseTokenWithPublicCerts(token);
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
    const decoded = await verifyFirebaseToken(token);
    const email = decoded.email?.toLowerCase();
    const adminEmails = getAdminEmails();

    return {
      uid: decoded.user_id || decoded.sub!,
      email,
      emailVerified: decoded.email_verified === true,
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
