<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import "../app.css";
	import { darkModeStore } from '$lib/store/products';
	import { authStore } from '$lib/store/auth';
	import { cartStore } from '$lib/store/cart';
	import { onMount } from 'svelte';
	import NavBar from '$lib/components/NavBar.svelte';

	let { children } = $props();

	onMount(() => {
		darkModeStore.init();
		authStore.init();
		cartStore.init();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>🛍️ FakeStore Dashboard</title>
</svelte:head>

<NavBar />

{@render children()}
