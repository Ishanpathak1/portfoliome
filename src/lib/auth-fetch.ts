import type { User } from 'firebase/auth';

export async function fetchWithUser(user: User, input: RequestInfo | URL, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  headers.set('Authorization', `Bearer ${await user.getIdToken()}`);

  let response = await fetch(input, { ...init, headers });
  if (response.status === 401) {
    headers.set('Authorization', `Bearer ${await user.getIdToken(true)}`);
    response = await fetch(input, { ...init, headers });
  }

  return response;
}
