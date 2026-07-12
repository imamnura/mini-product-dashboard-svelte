import { writable, type Writable } from 'svelte/store';
import { browser } from '$app/environment';
import { login as apiLogin } from '$lib/utils/api';
import { decodeFakeStoreToken } from '$lib/utils/jwt';

export interface AuthState {
  token: string | null;
  userId: number | null;
  username: string | null;
}

interface AuthStore {
  subscribe: Writable<AuthState>['subscribe'];
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  init: () => void;
}

const EMPTY_STATE: AuthState = { token: null, userId: null, username: null };
const STORAGE_KEY = 'auth';

function readStoredState(): AuthState {
  if (!browser) return EMPTY_STATE;

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return EMPTY_STATE;

  try {
    return { ...EMPTY_STATE, ...JSON.parse(raw) };
  } catch {
    return EMPTY_STATE;
  }
}

function createAuthStore(): AuthStore {
  const { subscribe, set } = writable<AuthState>(browser ? readStoredState() : EMPTY_STATE);

  return {
    subscribe,
    login: async (username: string, password: string) => {
      const token = await apiLogin(username, password);
      const identity = decodeFakeStoreToken(token);

      if (!identity) {
        throw new Error('Could not read the session returned by the server');
      }

      const state: AuthState = { token, userId: identity.userId, username: identity.username };

      if (browser) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      }
      set(state);
    },
    logout: () => {
      if (browser) {
        localStorage.removeItem(STORAGE_KEY);
      }
      set(EMPTY_STATE);
    },
    init: () => {
      if (browser) {
        set(readStoredState());
      }
    }
  };
}

export const authStore = createAuthStore();
