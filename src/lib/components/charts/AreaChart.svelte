<script lang="ts">
  interface TrendDatum {
    label: string;
    value: number;
  }

  interface Props {
    title: string;
    caption?: string;
    data: TrendDatum[];
    formatValue?: (value: number) => string;
    color?: string;
  }

  let { title, caption = '', data, formatValue = (v) => `${v}`, color = 'var(--chart-accent)' }: Props = $props();

  const MARGIN = { top: 16, right: 16, bottom: 26, left: 16 };
  const VIEW_W = 560;
  const VIEW_H = 190;
  const plotW = VIEW_W - MARGIN.left - MARGIN.right;
  const plotH = VIEW_H - MARGIN.top - MARGIN.bottom;

  let maxValue = $derived(Math.max(1, ...data.map((d) => d.value)) * 1.15);

  let points = $derived(
    data.map((d, i) => ({
      x: MARGIN.left + (data.length > 1 ? (i / (data.length - 1)) * plotW : plotW / 2),
      y: MARGIN.top + plotH - (d.value / maxValue) * plotH,
      label: d.label,
      value: d.value
    }))
  );

  let linePath = $derived(points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' '));
  let areaPath = $derived(
    points.length
      ? `${linePath} L ${points[points.length - 1].x},${MARGIN.top + plotH} L ${points[0].x},${MARGIN.top + plotH} Z`
      : ''
  );

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
    {#if data.length > 0}
      <button
        type="button"
        class="shrink-0 rounded-lg border border-violet-200 px-2.5 py-1 text-xs font-medium text-violet-700 hover:bg-violet-50 dark:border-violet-800 dark:text-violet-300 dark:hover:bg-violet-900/40"
        onclick={() => (tableView = !tableView)}
      >
        {tableView ? 'View chart' : 'View table'}
      </button>
    {/if}
  </div>

  {#if data.length === 0}
    <p class="mt-6 text-center text-sm text-violet-900/50 dark:text-violet-200/50">No cart history yet.</p>
  {:else if tableView}
    <table class="mt-4 w-full text-sm">
      <thead>
        <tr class="border-b border-violet-100 text-left text-violet-900/60 dark:border-violet-800 dark:text-violet-200/60">
          <th class="py-2 font-medium">Date</th>
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
    <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} class="mt-2 w-full" role="img" aria-label={`${title} trend chart`}>
      <path d={areaPath} fill={color} fill-opacity="0.1" stroke="none" />
      <path d={linePath} fill="none" stroke={color} stroke-width="2" stroke-linejoin="round" stroke-linecap="round" />

      {#each points as p, i}
        <circle cx={p.x} cy={p.y} r="4" fill={color} stroke="var(--chart-surface)" stroke-width="2">
          <title>{p.label}: {formatValue(p.value)}</title>
        </circle>
        <text
          x={p.x}
          y={p.y - 10}
          text-anchor="middle"
          font-size="11"
          fill="var(--chart-ink)"
          font-weight="600"
        >
          {formatValue(p.value)}
        </text>
        <text x={p.x} y={VIEW_H - 6} text-anchor="middle" font-size="10" fill="var(--chart-ink-muted)">
          {p.label}
        </text>
      {/each}
    </svg>
  {/if}
</div>
