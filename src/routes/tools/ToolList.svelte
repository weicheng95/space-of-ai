<script lang="ts">
	import ToolItem from './ToolItem.svelte';
	import type { Product } from '$lib/types/product';

	export let products: Product[];
</script>

<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
	{#each products as product}
		<ToolItem {product} />
	{/each}
</div>
