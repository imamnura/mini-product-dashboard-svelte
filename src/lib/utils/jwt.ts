import type { AuthUser } from '$lib/types';

interface FakeStoreJwtPayload {
  sub: number;
  user: string;
  iat: number;
}

/**
 * FakeStore's demo token is a real JWT but there is no public key to verify it against —
 * we only ever read the payload it hands back to us, never trust it as an auth boundary.
 */
export function decodeFakeStoreToken(token: string): AuthUser | null {
  try {
    const [, payloadSegment] = token.split('.');
    const normalized = payloadSegment.replace(/-/g, '+').replace(/_/g, '/');
    const json = atob(normalized);
    const payload: FakeStoreJwtPayload = JSON.parse(json);

    return { userId: payload.sub, username: payload.user };
  } catch {
    return null;
  }
}
