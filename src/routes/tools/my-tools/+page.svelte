<script lang="ts">
	import ToolItem from './ToolItem.svelte';
	import MyToolLayout from '../components/MyToolLayout.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<MyToolLayout>
	<div>
		{#await data.products}
			<p>Loading...</p>
		{:then products}
			{#if products && products.length > 0}
				<div class="grid grid-cols-1 gap-y-8">
					{#each products as product}
						<ToolItem {product} />
						<hr />
					{/each}
				</div>
			{/if}
		{/await}
	</div>
</MyToolLayout>
