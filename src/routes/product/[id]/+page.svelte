<script lang="ts">
  import { cartStore } from '$lib/store/cart';

  export let data: { product: any; meta: any };
  const { product, meta } = data;

  let quantity = 1;
  let added = false;

  function increment() {
    quantity += 1;
  }

  function decrement() {
    quantity = Math.max(1, quantity - 1);
  }

  function handleAddToCart() {
    cartStore.add(product, quantity);
    added = true;
    setTimeout(() => (added = false), 1500);
  }
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

<div class="mx-auto max-w-4xl p-6">
  <a href="/" class="mb-4 inline-block text-sm font-medium text-violet-600 hover:text-violet-700 dark:text-violet-300 dark:hover:text-violet-200">
    ← Kembali
  </a>
  <div class="glass-panel flex flex-col gap-6 rounded-2xl p-6 shadow-sm shadow-violet-900/5 sm:flex-col md:flex-row">
    <div class="flex w-full items-center justify-center rounded-xl bg-violet-50 p-6 md:w-1/3 dark:bg-violet-950/40">
      <img src={product.image} alt={product.title} class="w-full object-contain" />
    </div>
    <div class="flex-1">
      <h1 class="text-2xl font-bold text-violet-950 dark:text-white">{product.title}</h1>
      <p class="mt-2 text-violet-900/70 dark:text-violet-200/70">{product.description}</p>
      <p class="mt-4 text-xl font-semibold text-fuchsia-600 dark:text-fuchsia-300">${product.price}</p>
      <a
        href={`/category/${product.category}`}
        class="mt-2 inline-block rounded-full bg-violet-100 px-3 py-1 text-sm font-medium text-violet-700 dark:bg-violet-900/40 dark:text-violet-300"
      >
        {product.category}
      </a>

      <div class="mt-6 flex flex-wrap items-center gap-3">
        <div class="flex items-center rounded-xl border border-violet-200 dark:border-violet-800">
          <button
            type="button"
            onclick={decrement}
            class="px-3 py-2 text-violet-700 hover:bg-violet-50 dark:text-violet-300 dark:hover:bg-violet-900/40"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span class="w-8 text-center text-sm font-medium text-violet-950 dark:text-white">{quantity}</span>
          <button
            type="button"
            onclick={increment}
            class="px-3 py-2 text-violet-700 hover:bg-violet-50 dark:text-violet-300 dark:hover:bg-violet-900/40"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        <button
          type="button"
          onclick={handleAddToCart}
          class="rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-violet-500/30 transition-colors {added
            ? 'bg-emerald-600 hover:bg-emerald-600'
            : 'bg-violet-600 hover:bg-violet-700'}"
        >
          {added ? 'Added to cart ✓' : 'Add to cart'}
        </button>
      </div>
    </div>
  </div>
</div>
