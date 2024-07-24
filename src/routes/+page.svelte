<!-- src/routes/+page.svelte -->
<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import { searchMode } from '$lib/store/product';
	import { onDestroy } from 'svelte';
	import ToolContainer from './home/ToolContainer.svelte';
	import Seo from '$lib/components/global/seo/Seo.svelte';
	import CategoryList from './tools/components/CategoryList.svelte';

	export let data: PageData;
	export let form: ActionData;

	onDestroy(() => {
		searchMode.set(false);
	});

	const breadcrumbs = [
		{
			name: 'Home',
			slug: ''
		}
	];
</script>

<Seo {breadcrumbs} />

<main class="container pt-8 pb-20">
	<section class="cover mx-auto max-w-full pb-10 pt-10 sm:max-w-[70%]">
		<h1 class="mb-8 text-center text-3xl font-bold md:text-6xl">
			Choose the Best AI Tool for Your Needs
		</h1>
		<p class="mb-2 text-center md:text-lg">
			Find and use free AI tools easily with our platform. It helps you quickly compare and pick the
			best AI solution for what you need, all in one place.
		</p>
	</section>

	<section class="mb-8">
		<CategoryList {data} />
	</section>

	<ToolContainer {data} {form} />
</main>
