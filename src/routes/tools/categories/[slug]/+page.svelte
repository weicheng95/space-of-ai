<!-- src/routes/+page.svelte -->
<script lang="ts">
	import type { PageData } from './$types';
	import ProductList from './ToolList.svelte';
	import Seo from '$lib/components/global/seo/Seo.svelte';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { page } from '$app/stores';
	import NotAvailable from '$lib/components/icons/NotAvailable.svelte';
	import website from '$lib/website.config';
	import { PUBLIC_WEBSITE_URL } from '$env/static/public';
	import type { Product } from '$lib/types/product';

	export let data: PageData;

	let loading = false;
	let products = data.products as Product[];

	const breadcrumbs = [
		{
			name: 'Home',
			slug: ''
		},
		{
			name: 'Category',
			slug: '/tools/categories/' + $page.params.slug
		}
	];
</script>

<!-- svelte-ignore missing-declaration -->
<Seo
	url={PUBLIC_WEBSITE_URL + '/tools/categories/' + $page.params.slug}
	{breadcrumbs}
	title={products.length + ' ' + products?.[0]?.categories?.name + ' AI Tools'}
	description="Explore the best {products.length} AI-powered tools for {products?.[0]?.categories
		?.name} in our comprehensive list. Find top-rated software leveraging cutting-edge technology to streamline tasks and boost productivity. Discover user reviews to make an informed choice."
	imageAlt={'Space of AI cover image: ' + website.siteTitle}
	articleKeywords={products
		.slice(0, 30)
		.map((product) => product.name)
		.join(', ')}
/>

<main class="container py-8">
	<div>
		{#if loading}
			<div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
				{#each Array.from(Array(9).keys()) as _}
					<Skeleton class="h-[170px] w-full rounded-xl bg-zinc-80" />
				{/each}
			</div>
		{:else if products && products.length === 0}
			<div class="flex flex-col items-center justify-center text-center">
				<NotAvailable class="max-w-[40%]" />
				Unable to locate any tool.
			</div>
		{:else}
			<section class="cover mx-auto max-w-full pb-10 pt-10 sm:max-w-[70%]">
				<h1 class="mb-4 text-center text-3xl font-bold md:text-5xl">
					{data?.category?.name}
				</h1>
				<p class="mb-2 text-center md:text-lg">
					<span class="font-bold">{products.length}</span> AI Tools for {data?.category?.name}
				</p>
			</section>
			<ProductList {products} />
		{/if}
	</div>
</main>
