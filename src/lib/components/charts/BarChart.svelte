<script lang="ts">
  interface BarDatum {
    label: string;
    value: number;
  }

  interface Props {
    title: string;
    caption?: string;
    data: BarDatum[];
    formatValue?: (value: number) => string;
    color?: string;
  }

  let { title, caption = '', data, formatValue = (v) => `${v}`, color = 'var(--chart-accent)' }: Props = $props();

  let maxValue = $derived(Math.max(1, ...data.map((d) => d.value)) * 1.15);
  let hovered = $state<number | null>(null);
  let tableView = $state(false);
</script>

<div class="glass-panel rounded-2xl p-5 shadow-sm shadow-violet-900/5">
  <div class="flex items-start justify-between gap-3">
    <div>
      <h3 class="font-semibold text-violet-950 dark:text-white">{title}</h3>
      {#if caption}
        <p class="text-xs text-violet-900/50 dark:text-violet-200/50">{caption}</p>
      {/if}
    </div>
    <button
      type="button"
      class="shrink-0 rounded-lg border border-violet-200 px-2.5 py-1 text-xs font-medium text-violet-700 hover:bg-violet-50 dark:border-violet-800 dark:text-violet-300 dark:hover:bg-violet-900/40"
      onclick={() => (tableView = !tableView)}
    >
      {tableView ? 'View chart' : 'View table'}
    </button>
  </div>

  {#if tableView}
    <table class="mt-4 w-full text-sm">
      <thead>
        <tr class="border-b border-violet-100 text-left text-violet-900/60 dark:border-violet-800 dark:text-violet-200/60">
          <th class="py-2 font-medium">Category</th>
          <th class="py-2 font-medium text-right">Value</th>
        </tr>
      </thead>
      <tbody>
        {#each data as d}
          <tr class="border-b border-violet-50 dark:border-violet-900/50">
            <td class="py-2 text-violet-950 dark:text-white">{d.label}</td>
            <td class="py-2 text-right tabular-nums text-violet-950 dark:text-white">{formatValue(d.value)}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  {:else}
    <div class="mt-4 space-y-3">
      {#each data as d, i}
        {@const pct = (d.value / maxValue) * 100}
        <div
          class="group relative"
          role="img"
          aria-label={`${d.label}: ${formatValue(d.value)}`}
          onmouseenter={() => (hovered = i)}
          onmouseleave={() => (hovered = null)}
        >
          <div class="mb-1 flex items-center justify-between text-xs">
            <span class="truncate text-violet-900/70 dark:text-violet-200/70" title={d.label}>{d.label}</span>
            <span class="tabular-nums font-medium text-violet-950 dark:text-white">{formatValue(d.value)}</span>
          </div>
          <div class="h-3.5 w-full overflow-hidden rounded-full" style="background-color: var(--chart-grid);">
            <div
              class="h-full rounded-full transition-[width] duration-500 ease-out"
              style={`width: ${pct}%; background-color: ${color}; opacity: ${hovered === null || hovered === i ? 1 : 0.55};`}
            ></div>
          </div>

          {#if hovered === i}
            <div
              class="pointer-events-none absolute -top-8 left-0 rounded-lg px-2 py-1 text-xs font-medium text-white shadow-lg"
              style="background-color: var(--chart-ink);"
            >
              {d.label}: {formatValue(d.value)}
            </div>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</div>
