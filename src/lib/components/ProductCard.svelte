<script lang="ts">
  import { useIntersectionObserver } from '$lib/composables/useIntersectionObserver';
  import { cartStore } from '$lib/store/cart';
  import type { Product } from '$lib/types';

  interface Props {
    product: Product;
  }

  let { product }: Props = $props();
  let imgEl: HTMLElement | null = $state(null);
  let isVisible = $state(false);
  let justAdded = $state(false);

  const { observe } = useIntersectionObserver((intersecting) => {
    if (intersecting) {
      isVisible = true;
    }
  });

  $effect(() => {
    if (imgEl) {
      observe(imgEl);
    }
  });

  function handleAddToCart(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    cartStore.add(product);
    justAdded = true;
    setTimeout(() => (justAdded = false), 1200);
  }
</script>

<a
  href={`/product/${product.id}`}
  class="glass-panel group block rounded-2xl p-4 shadow-sm shadow-violet-900/5 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet-500/10"
  data-sveltekit-preload-data="tap"
>
  <div class="flex h-40 w-full items-center justify-center rounded-xl bg-violet-50 dark:bg-violet-950/40">
    {#if isVisible}
      <img
        bind:this={imgEl}
        src={product.image}
        alt={product.title}
        class="h-full w-full object-contain p-3 transition-opacity duration-500 opacity-100"
      />
    {:else}
      <!-- Placeholder skeleton -->
      <div
        bind:this={imgEl}
        class="h-full w-full animate-pulse rounded-xl bg-violet-100 dark:bg-violet-900/40"
      ></div>
    {/if}
  </div>

  <h2 class="mt-3 line-clamp-2 text-sm font-semibold text-violet-950 group-hover:text-violet-700 dark:text-white dark:group-hover:text-violet-300">
    {product.title}
  </h2>
  <div class="mt-2 flex items-center justify-between gap-2">
    <p class="font-bold text-violet-600 dark:text-violet-300">${product.price}</p>
    <button
      type="button"
      onclick={handleAddToCart}
      class="shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors {justAdded
        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
        : 'bg-violet-100 text-violet-700 hover:bg-violet-600 hover:text-white dark:bg-violet-900/40 dark:text-violet-300 dark:hover:bg-violet-600 dark:hover:text-white'}"
    >
      {justAdded ? 'Added ✓' : '+ Cart'}
    </button>
  </div>
</a>
