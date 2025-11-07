<script lang="ts">
  interface Props {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  }

  let { currentPage, totalPages, onPageChange }: Props = $props();
</script>

<div class="flex items-center justify-center gap-2 mt-6">
  <button
    class="px-3 py-1 border rounded disabled:opacity-50 dark:border-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
    onclick={() => onPageChange(currentPage - 1)}
    disabled={currentPage === 1}
  >
    ‹ Prev
  </button>

  {#each Array(totalPages) as _, i}
    <button
      class="px-3 py-1 border rounded hover:bg-gray-100 dark:border-gray-600 dark:text-white dark:hover:bg-gray-800"
      class:selected={currentPage === i + 1}
      onclick={() => onPageChange(i + 1)}
    >
      {i + 1}
    </button>
  {/each}

  <button
    class="px-3 py-1 border rounded disabled:opacity-50 dark:border-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
    onclick={() => onPageChange(currentPage + 1)}
    disabled={currentPage === totalPages}
  >
    Next ›
  </button>
</div>

<style>
  .selected {
    background-color: #2563eb;
    color: white;
  }
</style>
