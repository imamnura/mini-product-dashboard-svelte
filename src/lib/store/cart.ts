import { writable, derived, type Writable, type Readable } from 'svelte/store';
import { browser } from '$app/environment';
import type { CartLineItem, Product } from '$lib/types';

const STORAGE_KEY = 'cart';

interface CartStore {
  subscribe: Writable<CartLineItem[]>['subscribe'];
  add: (product: Product, quantity?: number) => void;
  remove: (productId: number) => void;
  setQuantity: (productId: number, quantity: number) => void;
  clear: () => void;
  init: () => void;
}

function readStoredItems(): CartLineItem[] {
  if (!browser) return [];

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as CartLineItem[];
  } catch {
    return [];
  }
}

function persist(items: CartLineItem[]) {
  if (browser) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }
}

function createCartStore(): CartStore {
  const { subscribe, update, set } = writable<CartLineItem[]>(browser ? readStoredItems() : []);

  return {
    subscribe,
    add: (product, quantity = 1) => {
      update((items) => {
        const existing = items.find((item) => item.product.id === product.id);
        const next = existing
          ? items.map((item) =>
              item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
            )
          : [...items, { product, quantity }];

        persist(next);
        return next;
      });
    },
    remove: (productId) => {
      update((items) => {
        const next = items.filter((item) => item.product.id !== productId);
        persist(next);
        return next;
      });
    },
    setQuantity: (productId, quantity) => {
      update((items) => {
        const next =
          quantity <= 0
            ? items.filter((item) => item.product.id !== productId)
            : items.map((item) => (item.product.id === productId ? { ...item, quantity } : item));

        persist(next);
        return next;
      });
    },
    clear: () => {
      persist([]);
      set([]);
    },
    init: () => {
      if (browser) {
        set(readStoredItems());
      }
    }
  };
}

export const cartStore = createCartStore();

export const cartCount: Readable<number> = derived(cartStore, (items) =>
  items.reduce((sum, item) => sum + item.quantity, 0)
);

export const cartSubtotal: Readable<number> = derived(cartStore, (items) =>
  items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
);
