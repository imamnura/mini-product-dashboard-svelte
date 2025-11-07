import { writable, type Writable } from "svelte/store";
import { browser } from '$app/environment';
import type { Product, Category } from '$lib/types';

export const productsStore: Writable<Product[]> = writable<Product[]>([]);
export const categoriesStore: Writable<Category[]> = writable<Category[]>([]);
export const selectedCategoryStore: Writable<string> = writable<string>('all');

// Dark mode store with localStorage persistence
interface DarkModeStore {
  subscribe: Writable<boolean>['subscribe'];
  toggle: () => void;
  init: () => void;
  set: (value: boolean) => void;
}

function createDarkModeStore(): DarkModeStore {
  const storedValue = browser ? localStorage.getItem('darkMode') === 'true' : false;
  const { subscribe, set, update } = writable<boolean>(storedValue);

  function applyDarkMode(isDark: boolean) {
    if (browser) {
      const htmlElement = document.documentElement;
      const bodyElement = document.body;
      
      if (isDark) {
        htmlElement.classList.add('dark');
        if (bodyElement) bodyElement.classList.add('dark');
      } else {
        htmlElement.classList.remove('dark');
        if (bodyElement) bodyElement.classList.remove('dark');
      }
    }
  }

  return {
    subscribe,
    toggle: () => update(value => {
      const newValue = !value;
      if (browser) {
        localStorage.setItem('darkMode', String(newValue));
        applyDarkMode(newValue);
      }
      return newValue;
    }),
    init: () => {
      if (browser) {
        const stored = localStorage.getItem('darkMode') === 'true';
        applyDarkMode(stored);
        set(stored);
      }
    },
    set: (value: boolean) => {
      if (browser) {
        localStorage.setItem('darkMode', String(value));
        applyDarkMode(value);
      }
      set(value);
    }
  };
}

export const darkModeStore = createDarkModeStore();