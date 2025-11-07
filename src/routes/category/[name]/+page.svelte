<script lang="ts">
  export let data: {
    name: any;
    items: any[]; products: any[] 
  };
  console.log(data);
</script>

<div class="p-6 max-w-6xl mx-auto">
  <a href="/" class="text-blue-600 dark:text-blue-400 underline mb-4 block">Semua produk</a>
  <h1 class="text-2xl font-bold capitalize mb-4 dark:text-white">{data.name}</h1>

  <div class="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
    {#each data.items as product}
      <a 
        href={`/product/${product.id}`} 
        class="border rounded-lg p-4 hover:shadow dark:border-gray-700 dark:bg-gray-800 transition-colors"
        data-sveltekit-preload-data="tap"
      >
      <img src={product.image} alt={product.title} class="w-full h-40 object-contain mb-3" loading="lazy" />
      <h2 class="font-semibold text-sm line-clamp-2 dark:text-white">{product.title}</h2>
      <p class="text-blue-600 dark:text-blue-400 font-bold mt-1">${product.price}</p>
    </a>
    {/each}
  </div>
</div>