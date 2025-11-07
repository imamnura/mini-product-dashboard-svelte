<script lang="ts">
  import { useIntersectionObserver } from '$lib/composables/useIntersectionObserver';
  import type { Product } from '$lib/types';

  interface Props {
    product: Product;
  }

  let { product }: Props = $props();
  let imgEl: HTMLElement | null = $state(null);
  let isVisible = $state(false);

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
</script>

<a 
  href={`/product/${product.id}`} 
  class="block border rounded-lg p-4 hover:shadow dark:border-gray-700 dark:bg-gray-800 transition-colors"
  data-sveltekit-preload-data="tap"
>
  <div class="w-full h-40 flex items-center justify-center bg-gray-50 dark:bg-gray-800">
    {#if isVisible}
      <img
        bind:this={imgEl}
        src={product.image}
        alt={product.title}
        class="w-full h-full object-contain transition-opacity duration-500 opacity-100"
      />
    {:else}
      <!-- Placeholder skeleton -->
      <div
        bind:this={imgEl}
        class="animate-pulse bg-gray-200 dark:bg-gray-700 w-full h-full rounded"
      ></div>
    {/if}
  </div>

  <h2 class="font-semibold text-sm line-clamp-2 mt-3 dark:text-white">{product.title}</h2>
  <p class="text-blue-600 dark:text-blue-400 font-bold mt-1">${product.price}</p>
</a>
