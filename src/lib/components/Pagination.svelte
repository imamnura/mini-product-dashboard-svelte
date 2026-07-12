<script lang="ts">
  interface Props {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  }

  let { currentPage, totalPages, onPageChange }: Props = $props();
</script>

<div class="mt-8 flex items-center justify-center gap-2">
  <button
    class="rounded-lg border border-violet-200 px-3 py-1.5 text-sm font-medium text-violet-900 transition-colors hover:bg-violet-100 disabled:opacity-40 disabled:hover:bg-transparent dark:border-violet-800 dark:text-violet-200 dark:hover:bg-violet-900/40"
    onclick={() => onPageChange(currentPage - 1)}
    disabled={currentPage === 1}
  >
    ‹ Prev
  </button>

  {#each Array(totalPages) as _, i}
    <button
      class="rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors {currentPage === i + 1
        ? 'border-violet-600 bg-violet-600 text-white shadow-sm shadow-violet-500/30'
        : 'border-violet-200 text-violet-900 hover:bg-violet-100 dark:border-violet-800 dark:text-violet-200 dark:hover:bg-violet-900/40'}"
      onclick={() => onPageChange(i + 1)}
    >
      {i + 1}
    </button>
  {/each}

  <button
    class="rounded-lg border border-violet-200 px-3 py-1.5 text-sm font-medium text-violet-900 transition-colors hover:bg-violet-100 disabled:opacity-40 disabled:hover:bg-transparent dark:border-violet-800 dark:text-violet-200 dark:hover:bg-violet-900/40"
    onclick={() => onPageChange(currentPage + 1)}
    disabled={currentPage === totalPages}
  >
    Next ›
  </button>
</div>
