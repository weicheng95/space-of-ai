<script lang="ts">
	import type { Pricing } from '$lib/types/product';
	import { Plus, X } from 'lucide-svelte';
	import PricingItem from './PricingItem.svelte';
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';

	const maxItem = 5;

	$: showRemoveButton = priceList && priceList.length > 1;
	$: showAddButton = priceList && priceList.length < maxItem;

	export let priceList: Pricing[] = [];
	export let errors: any;

	const addPricingItem = () => {
		if (priceList.length >= maxItem) return;
		priceList = [...priceList, { plan: '', price: 0, features: [''] }];
	};

	const removePricingItem = (index: number) => {
		if (priceList.length <= 1) return;

		priceList = priceList.filter((_, i) => index !== i);
	};
</script>

<div class="grid grid-cols-3 items-center gap-4">
	{#each priceList as pricingItem, index}
		<div class="relative h-full">
			<PricingItem bind:pricingItem errors={errors && errors[index]} />
			{#if showRemoveButton}
				<Button
					variant="link"
					class={cn('absolute end-1 top-0 w-fit rounded-full p-1 text-xs text-gray-400 font-normal')}
					on:click={() => removePricingItem(index)}
				>
					<X size="14" />
				</Button>
			{/if}
		</div>
	{/each}

	{#if showAddButton}
		<Button variant="ghost" class={cn('h-8 w-8 rounded-full p-1')} on:click={addPricingItem}>
			<Plus size="18" />
		</Button>
	{/if}
</div>
