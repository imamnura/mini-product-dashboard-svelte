<script lang="ts">
  export let data: {
    name: any;
    items: any[]; products: any[]
  };
</script>

<div class="mx-auto max-w-6xl p-6">
  <a href="/" class="mb-4 inline-block text-sm font-medium text-violet-600 hover:text-violet-700 dark:text-violet-300 dark:hover:text-violet-200">
    ← Semua produk
  </a>
  <h1 class="mb-4 text-2xl font-bold capitalize text-violet-950 dark:text-white">{data.name}</h1>

  <div class="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
    {#each data.items as product}
      <a
        href={`/product/${product.id}`}
        class="glass-panel group block rounded-2xl p-4 shadow-sm shadow-violet-900/5 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet-500/10"
        data-sveltekit-preload-data="tap"
      >
      <div class="mb-3 flex h-40 w-full items-center justify-center rounded-xl bg-violet-50 dark:bg-violet-950/40">
        <img src={product.image} alt={product.title} class="h-full w-full object-contain p-3" loading="lazy" />
      </div>
      <h2 class="line-clamp-2 text-sm font-semibold text-violet-950 group-hover:text-violet-700 dark:text-white dark:group-hover:text-violet-300">
        {product.title}
      </h2>
      <p class="mt-1 font-bold text-violet-600 dark:text-violet-300">${product.price}</p>
    </a>
    {/each}
  </div>
</div>
