<script lang="ts">
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/store/auth';

  let username = $state('');
  let password = $state('');
  let loading = $state(false);
  let error: string | null = $state(null);

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    loading = true;
    error = null;

    try {
      await authStore.login(username, password);
      goto('/analytics');
    } catch (err) {
      error = err instanceof Error ? err.message : 'Login failed';
    } finally {
      loading = false;
    }
  }

  function fillDemoCredentials() {
    username = 'johnd';
    password = 'm38rmF$';
  }
</script>

<svelte:head>
  <title>Login | FakeStore Dashboard</title>
</svelte:head>

<div class="mx-auto flex max-w-md flex-col p-6 pt-16">
  <div class="glass-panel rounded-2xl p-6 shadow-sm shadow-violet-900/5">
    <h1 class="text-xl font-bold text-violet-950 dark:text-white">Log in</h1>
    <p class="mt-1 text-sm text-violet-900/60 dark:text-violet-200/60">
      Sign in with your FakeStore account to see your personal cart insights.
    </p>

    <form class="mt-5 space-y-3" onsubmit={handleSubmit}>
      <div>
        <label for="username" class="mb-1 block text-xs font-medium text-violet-900/70 dark:text-violet-200/70">
          Username
        </label>
        <input
          id="username"
          bind:value={username}
          required
          class="w-full rounded-xl border border-violet-200 bg-white/80 p-2.5 text-sm text-violet-950 shadow-sm outline-none transition-colors focus:border-violet-400 focus:ring-2 focus:ring-violet-200 dark:border-violet-800 dark:bg-violet-950/40 dark:text-white dark:focus:ring-violet-800"
        />
      </div>

      <div>
        <label for="password" class="mb-1 block text-xs font-medium text-violet-900/70 dark:text-violet-200/70">
          Password
        </label>
        <input
          id="password"
          type="password"
          bind:value={password}
          required
          class="w-full rounded-xl border border-violet-200 bg-white/80 p-2.5 text-sm text-violet-950 shadow-sm outline-none transition-colors focus:border-violet-400 focus:ring-2 focus:ring-violet-200 dark:border-violet-800 dark:bg-violet-950/40 dark:text-white dark:focus:ring-violet-800"
        />
      </div>

      {#if error}
        <p class="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
          {error}
        </p>
      {/if}

      <button
        type="submit"
        disabled={loading}
        class="w-full rounded-xl bg-violet-600 py-2.5 text-sm font-semibold text-white shadow-sm shadow-violet-500/30 transition-colors hover:bg-violet-700 disabled:opacity-60"
      >
        {loading ? 'Signing in…' : 'Sign in'}
      </button>
    </form>

    <button
      type="button"
      onclick={fillDemoCredentials}
      class="mt-4 w-full rounded-lg border border-dashed border-violet-300 px-3 py-2 text-xs font-medium text-violet-700 hover:bg-violet-50 dark:border-violet-700 dark:text-violet-300 dark:hover:bg-violet-900/40"
    >
      Use FakeStore demo credentials
    </button>
  </div>
</div>
