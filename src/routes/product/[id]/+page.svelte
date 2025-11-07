<script lang="ts">
  export let data: { product: any; meta: any };
  const { product, meta } = data;
</script>

<svelte:head>
  <title>{product.title}</title>
  <meta name="description" content={meta.description} />
  <meta name="keywords" content={meta.keywords} />
  <meta property="og:title" content={meta.title} />
  <meta property="og:description" content={meta.description} />
  <meta property="og:image" content={meta.image} />
  <meta property="og:type" content="product" />
</svelte:head>

<div class="p-6 max-w-4xl mx-auto">
  <a href="/" class="text-blue-600 dark:text-blue-400 underline mb-4 block">Kembali</a>
  <div class="flex md:flex-col sm:flex-col flex-row gap-6">
    <img src={product.image} alt={product.title} class="w-full md:w-1/3 object-contain" />
    <div>
      <h1 class="text-2xl font-bold dark:text-white">{product.title}</h1>
      <p class="text-gray-600 dark:text-gray-300 mt-2">{product.description}</p>
      <p class="text-xl text-green-700 dark:text-green-400 font-semibold mt-4">${product.price}</p>
      <a href={`/category/${product.category}`} class="text-sm text-blue-500 dark:text-blue-400 underline mt-2 block">{product.category}</a>
    </div>
  </div>
</div>