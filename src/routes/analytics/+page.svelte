<script lang="ts">
  import { onMount } from 'svelte';
  import { getAllProducts, getCartsByUser } from '$lib/utils/api';
  import {
    buildDashboardStats,
    buildCartAnalytics,
    formatCurrency,
    formatCategoryLabel,
    type DashboardStats,
    type CartAnalytics
  } from '$lib/utils/chartData';
  import { authStore } from '$lib/store/auth';
  import type { Product } from '$lib/types';
  import StatTile from '$lib/components/charts/StatTile.svelte';
  import BarChart from '$lib/components/charts/BarChart.svelte';
  import DonutChart from '$lib/components/charts/DonutChart.svelte';
  import AreaChart from '$lib/components/charts/AreaChart.svelte';

  const CATEGORY_COLORS = ['var(--chart-cat-1)', 'var(--chart-cat-2)', 'var(--chart-cat-3)', 'var(--chart-cat-4)'];

  let stats: DashboardStats | null = $state(null);
  let allProducts: Product[] = $state([]);
  let loading = $state(true);
  let error: string | null = $state(null);

  let cartStats: CartAnalytics | null = $state(null);
  let cartLoading = $state(false);
  let cartError: string | null = $state(null);

  onMount(async () => {
    try {
      const products = await getAllProducts();
      allProducts = products;
      stats = buildDashboardStats(products);
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to load analytics';
    } finally {
      loading = false;
    }
  });

  $effect(() => {
    const userId = $authStore.userId;

    if (!userId) {
      cartStats = null;
      return;
    }

    if (allProducts.length === 0) return;

    cartLoading = true;
    cartError = null;

    getCartsByUser(userId)
      .then((carts) => {
        cartStats = buildCartAnalytics(carts, allProducts);
      })
      .catch((err) => {
        cartError = err instanceof Error ? err.message : 'Failed to load cart insights';
      })
      .finally(() => {
        cartLoading = false;
      });
  });
</script>

<svelte:head>
  <title>Analytics | FakeStore Dashboard</title>
</svelte:head>

<div class="mx-auto max-w-6xl p-6">
  <div class="mb-6">
    <h1 class="text-2xl font-bold text-violet-950 dark:text-white">Store analytics</h1>
    <p class="text-sm text-violet-900/60 dark:text-violet-200/60">
      Live figures computed from the FakeStore API catalog.
    </p>
  </div>

  {#if loading}
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {#each Array(4) as _}
        <div class="glass-panel h-24 animate-pulse rounded-2xl"></div>
      {/each}
    </div>
  {:else if error}
    <div class="glass-panel rounded-2xl p-6 text-center text-violet-900 dark:text-violet-200">
      <p class="font-medium">Couldn't load analytics</p>
      <p class="mt-1 text-sm text-violet-900/60 dark:text-violet-200/60">{error}</p>
    </div>
  {:else if stats}
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatTile label="Total products" value={String(stats.totalProducts)} icon="📦" />
      <StatTile label="Categories" value={String(stats.totalCategories)} icon="🏷️" />
      <StatTile label="Average price" value={formatCurrency(stats.avgPrice)} icon="💜" />
      <StatTile label="Average rating" value={`${stats.avgRating} / 5`} icon="⭐" />
    </div>

    <div class="mt-6 grid gap-4 lg:grid-cols-2">
      <DonutChart
        title="Category distribution"
        caption="Share of total catalog by category"
        centerLabel="products"
        centerValue={String(stats.totalProducts)}
        data={stats.categories.map((c, i) => ({
          label: formatCategoryLabel(c.category),
          value: c.count,
          color: CATEGORY_COLORS[i % CATEGORY_COLORS.length]
        }))}
      />

      <BarChart
        title="Average price by category"
        caption="Mean listed price, in USD"
        data={stats.categories.map((c) => ({ label: formatCategoryLabel(c.category), value: c.avgPrice }))}
        formatValue={formatCurrency}
      />

      <BarChart
        title="Average rating by category"
        caption="Mean customer rating, out of 5"
        data={stats.categories.map((c) => ({ label: formatCategoryLabel(c.category), value: c.avgRating }))}
        formatValue={(v) => `${v} / 5`}
      />

      <BarChart
        title="Products per category"
        caption="Number of listed products"
        data={stats.categories.map((c) => ({ label: formatCategoryLabel(c.category), value: c.count }))}
        formatValue={(v) => String(v)}
      />
    </div>

    <div class="mt-10">
      <h2 class="mb-4 text-lg font-semibold text-violet-950 dark:text-white">My cart insights</h2>

      {#if !$authStore.username}
        <div class="glass-panel rounded-2xl p-6 text-center">
          <p class="text-violet-900 dark:text-violet-200">
            Log in with your FakeStore account to see insights from your own cart history.
          </p>
          <a
            href="/login"
            class="mt-3 inline-block rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-violet-500/30 hover:bg-violet-700"
          >
            Log in
          </a>
        </div>
      {:else if cartLoading}
        <div class="grid gap-4 sm:grid-cols-3">
          {#each Array(3) as _}
            <div class="glass-panel h-24 animate-pulse rounded-2xl"></div>
          {/each}
        </div>
      {:else if cartError}
        <div class="glass-panel rounded-2xl p-6 text-center text-violet-900 dark:text-violet-200">
          <p class="font-medium">Couldn't load your cart insights</p>
          <p class="mt-1 text-sm text-violet-900/60 dark:text-violet-200/60">{cartError}</p>
        </div>
      {:else if cartStats}
        {#if cartStats.cartCount === 0}
          <div class="glass-panel rounded-2xl p-6 text-center text-violet-900/70 dark:text-violet-200/70">
            No carts found for this account yet.
          </div>
        {:else}
          <div class="grid gap-4 sm:grid-cols-3">
            <StatTile label="Carts" value={String(cartStats.cartCount)} icon="🛒" />
            <StatTile label="Total spend" value={formatCurrency(cartStats.totalSpend)} icon="💸" />
            <StatTile label="Avg cart value" value={formatCurrency(cartStats.avgCartValue)} icon="📊" />
          </div>

          <div class="mt-4 grid gap-4 lg:grid-cols-2">
            <AreaChart
              title="Cart value over time"
              caption="Total value per cart, chronologically"
              data={cartStats.trend}
              formatValue={formatCurrency}
            />
            <BarChart
              title="Top products in your carts"
              caption="By total quantity ordered"
              data={cartStats.topProducts.map((p) => ({ label: p.title, value: p.quantity }))}
              formatValue={(v) => `${v}x`}
            />
          </div>
        {/if}
      {/if}
    </div>
  {/if}
</div>
