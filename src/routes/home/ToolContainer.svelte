<script lang="ts">
	import { products } from '$lib/store/product';
	import ProductList from '../tools/ToolList.svelte';
	import type { ActionData, PageData } from '../$types';
	import SearchForm from '../tools/SearchForm.svelte';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import NotAvailable from '$lib/components/icons/NotAvailable.svelte';
	import { Button } from '$lib/components/ui/button';
	import { ChevronRight } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	export let data: PageData;
	export let form: ActionData;

	$: loading = true;
	$: hasNextPage = true;
	$: submitting = false;

	// this should only load once
	data.products.then((data) => {
		products.set(data.data);
		hasNextPage = data.hasNextPage;
		loading = false;
	});

	onMount(() => console.log('test'));
</script>

<div>
	<SearchForm
		class="mx-auto mb-8 max-w-full sm:mb-12 sm:max-w-[80%]"
		data={data.form}
		bind:isSubmitting={submitting}
		on:submit={({ detail: data }) =>
			goto('/browse?' + new URLSearchParams({ q: data.query }).toString())}
	/>

	{#if loading}
		<div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
			{#each Array.from(Array(9).keys()) as _}
				<Skeleton class="h-[170px] w-full rounded-xl bg-zinc-80" />
			{/each}
		</div>
	{:else if !loading && $products && $products.length === 0}
		<div class="flex flex-col items-center justify-center text-center">
			<NotAvailable class="max-w-[40%]" />
			Unable to locate any tool.
		</div>
	{:else}
		<ProductList products={$products} />

		<div class="my-6 flex justify-center">
			<Button variant="link" class="space-x-2" href="/browse">
				Explore all AI tools
				<ChevronRight size="18" />
			</Button>
		</div>
	{/if}
</div>
