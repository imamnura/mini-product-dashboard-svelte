import { writable } from 'svelte/store';
import { onMount } from 'svelte';
import { getProducts, getCategories } from '$lib/utils/api';
import { productsStore } from '$lib/store/products';
import { get } from 'svelte/store';
import type { Product, Category } from '$lib/types';

export function useProducts(itemsPerPage: number = 6) {
  const products = writable<Product[]>([]);
  const categories = writable<Category[]>([]);
  const loading = writable<boolean>(true);
  const error = writable<string | null>(null);
  const currentPage = writable<number>(1);
  const totalPages = writable<number>(1);

  async function loadProducts(page: number = 1) {
    loading.set(true);
    error.set(null);
    
    try {
      const { data, totalPages: tp } = await getProducts(itemsPerPage, page);
      products.set(data);
      totalPages.set(tp);
      currentPage.set(page);
      productsStore.set(data);
    } catch (err) {
      error.set(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      loading.set(false);
    }
  }

  async function loadCategories() {
    try {
      const cats = await getCategories();
      categories.set(cats);
    } catch (err) {
      error.set(err instanceof Error ? err.message : 'Failed to load categories');
    }
  }

  function initialize() {
    onMount(async () => {
      const cached = get(productsStore);
      if (cached.length) {
        products.set(cached);
        loading.set(false);
      } else {
        await loadProducts();
      }
      await loadCategories();
    });
  }

  return {
    products,
    categories,
    loading,
    error,
    currentPage,
    totalPages,
    loadProducts,
    loadCategories,
    initialize
  };
}
