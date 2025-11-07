<script lang="ts">
  import { onMount } from 'svelte';
  import { getProducts, getCategories } from '$lib/utils/api';
  import ProductCard from '$lib/components/ProductCard.svelte';
  import Pagination from '$lib/components/Pagination.svelte';
  import { productsStore, darkModeStore } from '$lib/store/products';
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
  }

  function handlePageChange(page: number) {
    currentPage = page;
    loadData();
  }

  onMount(async () => {
    const cached = get(productsStore);
    if (cached.length) {
      products = cached;
      loading = false;
    } else {
      await loadData();
    }

    categories = await getCategories();
  });

  $: filtered = products.filter(product => product.title.toLowerCase().includes(search.toLocaleLowerCase()) && (selectedCategory ? product.category === selectedCategory : true));
  $: debouncedSearch = debounce((val) => (search = val), 300);

</script>

<div class="p-6 max-w-6xl mx-auto">
  <div class="flex flex-row items-center mb-6 justify-between">
    <h1 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">🛍️ FakeStore Dashboard</h1>
    <button
      onclick={() => darkModeStore.toggle()}
      class="fixed top-4 right-4 bg-gray-200 dark:bg-gray-700 p-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      aria-label="Toggle dark mode"
    >
      {$darkModeStore ? '🌙' : '☀️'}
    </button>
  </div>

  <!-- Filter & Search -->
  <div class="flex flex-wrap gap-2 mb-4">
    <input 
      placeholder="Cari produk.." 
      bind:value={search} 
      class="border rounded p-2 w-full md:w-1/3 dark:bg-gray-800 dark:text-white dark:border-gray-600" 
      oninput={(e) => debouncedSearch((e.target as HTMLInputElement).value)} 
    />
    <select 
      bind:value={selectedCategory} 
      class="border rounded p-2 dark:bg-gray-800 dark:text-white dark:border-gray-600"
    >
      <option value="">Semua Kategori</option>
      {#each categories as c}
        <option value={c}>{c}</option>
      {/each}
    </select>
  </div>

  {#if loading}
  <p class="dark:text-white">Loading...</p>
  {:else}
  <div class="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
    {#each filtered as product}
      <ProductCard {product} />
    {/each}
  </div>

  <Pagination {currentPage} {totalPages} onPageChange={handlePageChange} />
  {/if}
</div>