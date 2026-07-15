<script lang="ts">
  import { onMount } from 'svelte';
  import { getProducts, getCategories } from '$lib/utils/api';
  import ProductCard from '$lib/components/ProductCard.svelte';
  import Pagination from '$lib/components/Pagination.svelte';
  import { productsStore, paginationStore } from '$lib/store/products';
  import { get } from 'svelte/store';
  import { debounce } from '$lib/utils/debounce';


  let products: any[] = [];
  let categories: any[] = [];
  let loading = true;
  let selectedCategory = '';
  let search = '';
  let currentPage = 1;
  let totalPages = 1;

  async function loadData() {
    loading = true;
    const { data, totalPages: tp } = await getProducts(6, currentPage);
    products = data;
    totalPages = tp;
    loading = false;
    productsStore.set(products);
    paginationStore.set({ currentPage, totalPages });
  }

  function handlePageChange(page: number) {
    currentPage = page;
    loadData();
  }

  onMount(async () => {
    const cached = get(productsStore);
    if (cached.length) {
      products = cached;
      ({ currentPage, totalPages } = get(paginationStore));
      loading = false;
    } else {
      await loadData();
    }

    categories = await getCategories();
  });

  $: filtered = products.filter(product => product.title.toLowerCase().includes(search.toLocaleLowerCase()) && (selectedCategory ? product.category === selectedCategory : true));
  $: debouncedSearch = debounce((val) => (search = val), 300);

</script>

<div class="mx-auto max-w-6xl p-6">
  <div class="mb-6">
    <h1 class="text-2xl font-bold text-violet-950 dark:text-white">🛍️ Product catalog</h1>
    <p class="text-sm text-violet-900/60 dark:text-violet-200/60">Discover products from the FakeStore catalog.</p>
  </div>

  <!-- Filter & Search -->
  <div class="mb-6 flex flex-wrap gap-3">
    <input
      placeholder="Cari produk.."
      bind:value={search}
      class="w-full rounded-xl border border-violet-200 bg-white/80 p-2.5 text-sm text-violet-950 shadow-sm outline-none transition-colors focus:border-violet-400 focus:ring-2 focus:ring-violet-200 md:w-1/3 dark:border-violet-800 dark:bg-violet-950/40 dark:text-white dark:focus:ring-violet-800"
      oninput={(e) => debouncedSearch((e.target as HTMLInputElement).value)}
    />
    <select
      bind:value={selectedCategory}
      class="rounded-xl border border-violet-200 bg-white/80 p-2.5 text-sm text-violet-950 shadow-sm outline-none transition-colors focus:border-violet-400 focus:ring-2 focus:ring-violet-200 dark:border-violet-800 dark:bg-violet-950/40 dark:text-white dark:focus:ring-violet-800"
    >
      <option value="">Semua Kategori</option>
      {#each categories as c}
        <option value={c}>{c}</option>
      {/each}
    </select>
  </div>

  {#if loading}
  <div class="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
    {#each Array(6) as _}
      <div class="glass-panel h-64 animate-pulse rounded-2xl"></div>
    {/each}
  </div>
  {:else}
  <div class="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
    {#each filtered as product}
      <ProductCard {product} />
    {/each}
  </div>

  <Pagination {currentPage} {totalPages} onPageChange={handlePageChange} />
  {/if}
</div>
