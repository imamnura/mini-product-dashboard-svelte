<script lang="ts">
  import { cartStore, cartSubtotal } from '$lib/store/cart';
  import { authStore } from '$lib/store/auth';
  import { createCart } from '$lib/utils/api';
  import { formatCurrency } from '$lib/utils/chartData';

  let checkingOut = $state(false);
  let checkoutError: string | null = $state(null);
  let orderId: number | null = $state(null);

  async function handleCheckout() {
    const userId = $authStore.userId;
    if (!userId) return;

    checkingOut = true;
    checkoutError = null;

    try {
      const order = await createCart(
        userId,
        $cartStore.map((item) => ({ productId: item.product.id, quantity: item.quantity }))
      );
      orderId = order.id;
      cartStore.clear();
    } catch (err) {
      checkoutError = err instanceof Error ? err.message : 'Checkout failed';
    } finally {
      checkingOut = false;
    }
  }
</script>

<svelte:head>
  <title>Your Cart | FakeStore Dashboard</title>
</svelte:head>

<div class="mx-auto max-w-4xl p-6">
  <h1 class="mb-6 text-2xl font-bold text-violet-950 dark:text-white">Your cart</h1>

  {#if orderId}
    <div class="glass-panel rounded-2xl p-8 text-center">
      <p class="text-3xl">🎉</p>
      <p class="mt-2 text-lg font-semibold text-violet-950 dark:text-white">Order #{orderId} placed!</p>
      <p class="mt-1 text-sm text-violet-900/60 dark:text-violet-200/60">
        This is a demo checkout against the FakeStore API — no real order was processed.
      </p>
      <a
        href="/"
        class="mt-5 inline-block rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-violet-500/30 hover:bg-violet-700"
      >
        Continue shopping
      </a>
    </div>
  {:else if $cartStore.length === 0}
    <div class="glass-panel rounded-2xl p-8 text-center">
      <p class="text-3xl">🛒</p>
      <p class="mt-2 text-violet-900/70 dark:text-violet-200/70">Your cart is empty.</p>
      <a
        href="/"
        class="mt-4 inline-block rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-violet-500/30 hover:bg-violet-700"
      >
        Browse products
      </a>
    </div>
  {:else}
    <div class="space-y-3">
      {#each $cartStore as item (item.product.id)}
        <div class="glass-panel flex items-center gap-4 rounded-2xl p-4 shadow-sm shadow-violet-900/5">
          <div class="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-violet-50 dark:bg-violet-950/40">
            <img src={item.product.image} alt={item.product.title} class="h-full w-full object-contain p-1.5" />
          </div>

          <div class="min-w-0 flex-1">
            <a
              href={`/product/${item.product.id}`}
              class="line-clamp-1 text-sm font-semibold text-violet-950 hover:text-violet-700 dark:text-white dark:hover:text-violet-300"
            >
              {item.product.title}
            </a>
            <p class="mt-0.5 text-sm text-violet-900/60 dark:text-violet-200/60">
              {formatCurrency(item.product.price)}
            </p>
          </div>

          <div class="flex items-center rounded-lg border border-violet-200 dark:border-violet-800">
            <button
              type="button"
              onclick={() => cartStore.setQuantity(item.product.id, item.quantity - 1)}
              class="px-2.5 py-1.5 text-violet-700 hover:bg-violet-50 dark:text-violet-300 dark:hover:bg-violet-900/40"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span class="w-6 text-center text-sm font-medium text-violet-950 dark:text-white">{item.quantity}</span>
            <button
              type="button"
              onclick={() => cartStore.setQuantity(item.product.id, item.quantity + 1)}
              class="px-2.5 py-1.5 text-violet-700 hover:bg-violet-50 dark:text-violet-300 dark:hover:bg-violet-900/40"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          <p class="w-20 shrink-0 text-right text-sm font-semibold text-violet-950 dark:text-white">
            {formatCurrency(item.product.price * item.quantity)}
          </p>

          <button
            type="button"
            onclick={() => cartStore.remove(item.product.id)}
            class="shrink-0 rounded-lg p-2 text-violet-400 hover:bg-rose-50 hover:text-rose-600 dark:text-violet-500 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
            aria-label={`Remove ${item.product.title}`}
          >
            ✕
          </button>
        </div>
      {/each}
    </div>

    <div class="glass-panel mt-6 rounded-2xl p-5 shadow-sm shadow-violet-900/5">
      <div class="flex items-center justify-between text-sm text-violet-900/70 dark:text-violet-200/70">
        <span>Subtotal</span>
        <span class="font-semibold text-violet-950 dark:text-white">{formatCurrency($cartSubtotal)}</span>
      </div>

      {#if checkoutError}
        <p class="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
          {checkoutError}
        </p>
      {/if}

      {#if $authStore.username}
        <button
          type="button"
          onclick={handleCheckout}
          disabled={checkingOut}
          class="mt-4 w-full rounded-xl bg-violet-600 py-2.5 text-sm font-semibold text-white shadow-sm shadow-violet-500/30 transition-colors hover:bg-violet-700 disabled:opacity-60"
        >
          {checkingOut ? 'Placing order…' : 'Checkout'}
        </button>
      {:else}
        <a
          href="/login"
          class="mt-4 block w-full rounded-xl bg-violet-600 py-2.5 text-center text-sm font-semibold text-white shadow-sm shadow-violet-500/30 hover:bg-violet-700"
        >
          Log in to checkout
        </a>
      {/if}
    </div>
  {/if}
</div>
