<script lang="ts">
  import { page } from '$app/stores';
  import { darkModeStore } from '$lib/store/products';
  import { authStore } from '$lib/store/auth';
  import { cartCount } from '$lib/store/cart';
  import { goto } from '$app/navigation';

  function handleLogout() {
    authStore.logout();
    goto('/');
  }

  let links = [
    { href: '/', label: 'Products' },
    { href: '/analytics', label: 'Analytics' }
  ];
</script>

<header class="sticky top-0 z-20 glass-panel border-b border-violet-100/60 dark:border-violet-900/40">
  <div class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
    <a href="/" class="flex items-center gap-2">
      <span
        class="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-400 text-base shadow-sm shadow-violet-500/30"
      >
        🛍️
      </span>
      <span class="text-lg font-semibold tracking-tight text-violet-950 dark:text-white">
        Fake<span class="text-violet-600 dark:text-violet-300">Store</span>
      </span>
    </a>

    <nav class="flex items-center gap-1">
      {#each links as link}
        <a
          href={link.href}
          class="rounded-lg px-3 py-1.5 text-sm font-medium transition-colors {$page.url.pathname === link.href
            ? 'bg-violet-600 text-white shadow-sm shadow-violet-500/30'
            : 'text-violet-900/70 hover:bg-violet-100 dark:text-violet-200/70 dark:hover:bg-violet-900/40'}"
        >
          {link.label}
        </a>
      {/each}

      {#if $authStore.username}
        <span class="hidden pl-2 text-sm text-violet-900/70 sm:inline dark:text-violet-200/70">
          Hi, {$authStore.username}
        </span>
        <button
          onclick={handleLogout}
          class="rounded-lg px-3 py-1.5 text-sm font-medium text-violet-900/70 hover:bg-violet-100 dark:text-violet-200/70 dark:hover:bg-violet-900/40"
        >
          Logout
        </button>
      {:else}
        <a
          href="/login"
          class="rounded-lg px-3 py-1.5 text-sm font-medium text-violet-900/70 hover:bg-violet-100 dark:text-violet-200/70 dark:hover:bg-violet-900/40"
        >
          Login
        </a>
      {/if}

      <a
        href="/cart"
        class="relative rounded-lg px-3 py-1.5 text-sm font-medium transition-colors {$page.url.pathname === '/cart'
          ? 'bg-violet-600 text-white shadow-sm shadow-violet-500/30'
          : 'text-violet-900/70 hover:bg-violet-100 dark:text-violet-200/70 dark:hover:bg-violet-900/40'}"
        aria-label={`Cart, ${$cartCount} item${$cartCount === 1 ? '' : 's'}`}
      >
        🛒
        {#if $cartCount > 0}
          <span
            class="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-fuchsia-500 px-1 text-[10px] font-bold text-white"
          >
            {$cartCount}
          </span>
        {/if}
      </a>

      <button
        onclick={() => darkModeStore.toggle()}
        class="ml-1 rounded-lg border border-violet-200 p-2 text-sm hover:bg-violet-100 dark:border-violet-800 dark:hover:bg-violet-900/40"
        aria-label="Toggle dark mode"
      >
        {$darkModeStore ? '🌙' : '☀️'}
      </button>
    </nav>
  </div>
</header>
