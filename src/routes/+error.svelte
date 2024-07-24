<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import NotFound from '$lib/components/icons/NotFound.svelte';
	import { Button } from '$lib/components/ui/button';

	onMount(async () => {});

	if (browser) {
	}
</script>

<main class="container flex h-full flex-col items-center justify-center py-8">
	{#if $page.status === 404}
		<NotFound class="w-full max-w-[60%]" />
		<h1 class="text-center text-xl mb-4">Page not found</h1>
		<Button href="/">Back to home</Button>
	{:else if $page.error?.message}
		<h1 class="text-center text-3xl">{$page.error.message}</h1>
	{:else}
		<h1 class="text-center text-3xl">Something went wrong!</h1>
	{/if}
</main>
