<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import MyToolLayout from '../components/MyToolLayout.svelte';
	import SubmitToolForm from './SubmitToolForm.svelte';
	import type { PageData } from './$types';
	import type { Category } from '$lib/types/product';

	export let data: PageData;

	let categories: Category[] = [];

	data.categories.then((dataCategories) => {
		if (!dataCategories) return;
		categories = dataCategories;
	});
</script>

<MyToolLayout>
	<div class="grid gap-6">
		<Card.Root>
			<Card.Content class="py-8">
				<SubmitToolForm data={data.form} {categories} />
			</Card.Content>
		</Card.Root>
	</div>
</MyToolLayout>
