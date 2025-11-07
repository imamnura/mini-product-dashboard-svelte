<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import "../app.css";
	import { darkModeStore } from '$lib/store/products';
	import { onMount } from 'svelte';

	let { children } = $props();

	onMount(() => {
		darkModeStore.init();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>🛍️ FakeStore Dashboard</title>
</svelte:head>

{@render children()}
