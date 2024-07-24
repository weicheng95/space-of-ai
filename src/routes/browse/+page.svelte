<!-- src/routes/+page.svelte -->
<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import { searchMode } from '$lib/store/product';
	import { onDestroy } from 'svelte';
	import Seo from '$lib/components/global/seo/Seo.svelte';
	import CategoryList from '../tools/components/CategoryList.svelte';
	import ToolContainer from './ToolContainer.svelte';

	export let data: PageData;
	export let form: ActionData;

	onDestroy(() => {
		searchMode.set(false);
	});

	const breadcrumbs = [
		{
			name: 'Home',
			slug: ''
		},
		{
			name: 'Browse',
			slug: 'browse'
		}
	];
</script>

<Seo {breadcrumbs} />

<main class="container pb-20 pt-8">
	<section class="cover mx-auto max-w-full pb-10 pt-10 sm:max-w-[70%]">
		<h1 class="mb-8 text-center text-3xl font-bold md:text-6xl">All AI Tools List</h1>
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
