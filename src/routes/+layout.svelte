<script lang="ts">
	import '../app.pcss';
	import Header from '$lib/components/global/header/header.svelte';
	import { Toaster } from '$lib/components/ui/sonner';
	import { beforeNavigate, afterNavigate } from '$app/navigation';
	import GlobalLoader from '$lib/components/global/loader/GlobalLoader.svelte';
	import { browser } from '$app/environment';
	import GoogleAnalytic from '$lib/components/global/analytics/GoogleAnalytic.svelte';
	import Footer from '$lib/components/global/footer/footer.svelte';

	let isLoading = false;

	beforeNavigate(({ to }) => {
		return (isLoading = !!(to && to.route.id));
	});
	afterNavigate(() => {
		setTimeout(() => {
			isLoading = false;
		}, 300);
	});
</script>

<svelte:head>
	<title>Space of AI</title>
</svelte:head>

{#if isLoading}
	<GlobalLoader />
{/if}

{#if browser}
	<GoogleAnalytic />
{/if}

<div class="flex flex-col h-full">
	<Header />
	<slot class="flex-1" />
	<Footer />
</div>

<Toaster theme="light" expand={true} />
