<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';
	import PricingFeature from './PricingFeature.svelte';
	import { CircleX, Plus } from 'lucide-svelte';

	export let features: string[] = [];
	export let errors: any[];

	const maxFeatures = 10;

	const addFeature = () => {
		if (features.length >= maxFeatures) return;
		features = [...features, ''];
	};

	const removeFeature = (selectedIndex: number) => {
		if (features.length <= 1) return;
		features = features.filter((_, i) => selectedIndex !== i);
	};
</script>

<div class="grid grid-flow-row">
	{#each features as feature, index}
		<div class="flex items-center justify-between">
			<PricingFeature bind:feature errors={errors && errors[index]} />
			
			{#if features.length > 1}
				<Button
					variant="ghost"
					class={cn('hover:bg-transparent')}
					on:click={() => removeFeature(index)}
				>
					<CircleX size="14" />
				</Button>
			{/if}
		</div>
	{/each}

	{#if features.length < maxFeatures}
	<Button on:click={addFeature} variant="ghost" class={cn('hover:bg-transparent')}>
		<Plus size="14" />
	</Button>
	{/if}
</div>
