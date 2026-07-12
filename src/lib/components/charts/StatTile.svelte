<script lang="ts">
  interface Props {
    label: string;
    value: string;
    icon?: string;
    hint?: string;
  }

  let { label, value, icon = '', hint = '' }: Props = $props();
</script>

<div class="glass-panel rounded-2xl p-5 shadow-sm shadow-violet-900/5">
  <div class="flex items-center justify-between">
    <p class="text-sm font-medium text-violet-900/70 dark:text-violet-200/70">{label}</p>
    {#if icon}
      <span class="text-xl" aria-hidden="true">{icon}</span>
    {/if}
  </div>
  <p class="mt-2 text-3xl font-semibold tracking-tight text-violet-950 dark:text-white">
    {value}
  </p>
  {#if hint}
    <p class="mt-1 text-xs text-violet-900/50 dark:text-violet-200/50">{hint}</p>
  {/if}
</div>
