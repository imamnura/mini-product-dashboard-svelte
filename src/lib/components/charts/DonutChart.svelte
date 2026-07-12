<script lang="ts">
  interface DonutDatum {
    label: string;
    value: number;
    color: string;
  }

  interface Props {
    title: string;
    caption?: string;
    data: DonutDatum[];
    centerLabel?: string;
    centerValue?: string;
  }

  let { title, caption = '', data, centerLabel = '', centerValue = '' }: Props = $props();

  const GAP_DEG = 3;

  let total = $derived(data.reduce((sum, d) => sum + d.value, 0));

  let gradient = $derived.by(() => {
    if (!total) return 'var(--chart-grid)';
    let angle = 0;
    const stops: string[] = [];
    for (const d of data) {
      const sweep = (d.value / total) * 360;
      const start = angle;
      const end = angle + Math.max(sweep - GAP_DEG, 0);
      stops.push(`${d.color} ${start}deg ${end}deg`);
      stops.push(`var(--chart-surface) ${end}deg ${angle + sweep}deg`);
      angle += sweep;
    }
    return `conic-gradient(${stops.join(', ')})`;
  });

  let hovered = $state<number | null>(null);
</script>

<div class="glass-panel rounded-2xl p-5 shadow-sm shadow-violet-900/5">
  <h3 class="font-semibold text-violet-950 dark:text-white">{title}</h3>
  {#if caption}
    <p class="text-xs text-violet-900/50 dark:text-violet-200/50">{caption}</p>
  {/if}

  <div class="mt-4 flex flex-col items-center gap-6 sm:flex-row sm:items-center">
    <div class="relative h-40 w-40 shrink-0 rounded-full" style={`background: ${gradient};`}>
      <div
        class="absolute inset-[18%] flex flex-col items-center justify-center rounded-full text-center"
        style="background-color: var(--chart-surface);"
      >
        {#if centerValue}
          <span class="text-xl font-semibold text-violet-950 dark:text-white">{centerValue}</span>
        {/if}
        {#if centerLabel}
          <span class="text-[11px] text-violet-900/50 dark:text-violet-200/50">{centerLabel}</span>
        {/if}
      </div>
    </div>

    <ul class="w-full space-y-2">
      {#each data as d, i}
        <li
          class="flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 text-sm transition-colors"
          style={`background-color: ${hovered === i ? 'var(--chart-accent-soft)' : 'transparent'};`}
          role="img"
          aria-label={`${d.label}: ${d.value} (${total ? Math.round((d.value / total) * 100) : 0}%)`}
          onmouseenter={() => (hovered = i)}
          onmouseleave={() => (hovered = null)}
        >
          <span class="flex min-w-0 items-center gap-2">
            <span class="h-2.5 w-2.5 shrink-0 rounded-sm" style={`background-color: ${d.color};`}></span>
            <span class="truncate text-violet-900/80 dark:text-violet-200/80">{d.label}</span>
          </span>
          <span class="shrink-0 tabular-nums font-medium text-violet-950 dark:text-white">
            {d.value} · {total ? Math.round((d.value / total) * 100) : 0}%
          </span>
        </li>
      {/each}
    </ul>
  </div>
</div>
