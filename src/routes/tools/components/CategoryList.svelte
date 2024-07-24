<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import type { PageData } from '../../$types';
	import * as Carousel from '$lib/components/ui/carousel/index';

	export let data: PageData;
</script>

{#await data.categories}
{:then categories}
	<div class="scrollbar-none flex overflow-scroll">
		<Carousel.Root
			class="w-full"
			opts={{
				align: 'start',
				loop: true,
				dragFree: true
			}}
		>
			<Carousel.Content>
				{#each categories as category}
					<Carousel.Item class="w-fit flex-none">
						<Button variant="ghost" href={`/tools/categories/${category.id}-${encodeURIComponent(category.name)}`}
							>{category.name}</Button
						>
					</Carousel.Item>
				{/each}
			</Carousel.Content>
		</Carousel.Root>
	</div>
{:catch error}
	<p style="color: red">{error.message}</p>
{/await}
