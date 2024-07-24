<script lang="ts">
	import { products, searchMeta, searchMode } from '$lib/store/product';
	import type { ActionData, PageData } from './$types';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import NotAvailable from '$lib/components/icons/NotAvailable.svelte';
	import SearchForm from '../tools/SearchForm.svelte';
	import ToolList from '../tools/ToolList.svelte';
	import type { Infer, SuperForm } from 'sveltekit-superforms';
	import type { SearchFormSchema } from '../home/schema';

	export let data: PageData;
	export let form: ActionData;

	$: loading = true;
	$: y = 0;
	$: page = 1;
	$: loadingMore = false;
	$: hasNextPage = true;
	$: submitting = false;

	// this should only load once
	data.products.then((res) => {
		products.set(res.data);
		hasNextPage = res.hasNextPage;
		loading = false;

		if (data.searchMode) {
			searchMode.set(true);
			searchMeta.set({
				total: res.data.length,
				query: data.query
			});
		}
	});

	// only lazy load more result if this is not under search mode
	$: if (y && !loading && !$searchMode) {
		const docHeight = document?.body?.clientHeight;
		if (y + 1500 > docHeight && !loadingMore && hasNextPage) {
			loadMore();
		}
	}

	const loadMore = async () => {
		loadingMore = true;
		try {
			const res = await fetch(`/api/v1/products?page=${page}`);

			if (res.status !== 200) {
				loading = false;
				alert('something wrong');
			}

			const data: any = await res.json();
			hasNextPage = data && data.hasNextPage;
			if (data && data.data) {
				products.update((p) => [...p, ...data.data]);
			}
			if (hasNextPage) {
				page += 1;
			}
			loadingMore = false;
		} catch (err) {
			console.log(err);
		}
	};

	const handleSubmit = async (formData: Infer<SearchFormSchema>) => {
		searchMode.set(true);
		submitting = true;

		try {
			const res = await fetch(`/api/v1/products/search?query=${formData.query}`);
			const { data }: any = await res.json();

			submitting = false;
			// update products store
			products.set(data);
			// set search meta data
			searchMeta.set({
				total: data.length,
				query: formData.query
			});
		} catch (err) {
			console.error(err);
		}
	};

	const handleValueUpdate = (formData: Infer<SearchFormSchema>) => {
		// Get the current URL and its query parameters
		const url = new URL(window.location.href);
		url.searchParams.set('q', formData.query);
		// Use history.pushState to update the URL without causing a navigation event
		window.history.pushState({}, '', url);
	};
</script>

<svelte:window bind:scrollY={y} />

<div>
	<SearchForm
		class="mx-auto mb-8 max-w-full sm:mb-12 sm:max-w-[80%]"
		data={data.form}
		isSubmitting={submitting}
		on:value={({ detail: data }) => handleValueUpdate(data)}
		on:submit={({ detail: data }) => handleSubmit(data)}
	/>

	{#if loading || submitting}
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
		{#if $searchMode && $searchMeta}
			<p class="mb-4 text-sm font-medium">{$searchMeta.total} results for "{$searchMeta.query}"</p>
		{/if}
		<ToolList products={$products}></ToolList>

		{#if loadingMore}
			<div class="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
				{#each Array.from(Array(3).keys()) as _}
					<Skeleton class="h-[170px] w-full rounded-xl bg-zinc-80" />
				{/each}
			</div>
		{/if}
	{/if}
</div>
