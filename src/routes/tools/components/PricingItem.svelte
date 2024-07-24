<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import Input from '$lib/components/ui/input/input.svelte';
	import type { Pricing } from '$lib/types/product';
	import { cn } from '$lib/utils';
	import PricingFeatures from './PricingFeatures.svelte';

	export let pricingItem: Pricing;
	export let errors: any;
</script>

<Card.Root class="h-full">
	<Card.Content class="p-4">
		<div class="p-0">
			<Card.Description class="grid grid-flow-row p-0">
				<div class="relative">
					<Input
						data-invalid={errors?.plan}
						bind:value={pricingItem.plan}
						placeholder="Plan Name"
						class={cn(
							'h-auto w-full border-transparent py-1 font-semibold text-zinc-950 shadow-none hover:border hover:border-solid hover:border-zinc-950'
						)}
					/>
					{#if errors?.plan}
						<span class="invalid ps-3 text-xs text-red-500">{errors?.plan}</span>
					{/if}
				</div>

				<div class="relative font-semibold text-zinc-950">
					<span class="absolute bottom-0 start-0 top-0 flex items-center ps-3 text-base">$</span>
					<Input
						data-invalid={errors?.price}
						bind:value={pricingItem.price}
						type="number"
						placeholder="Price"
						class={cn(`h-auto w-full appearance-none border-transparent py-0 
						ps-7 text-lg
						shadow-none hover:border hover:border-solid hover:border-zinc-950`)}
					/>
				</div>
				{#if errors?.price}
					<span class="invalid ps-3 text-xs text-red-500">{errors?.price}</span>
				{/if}

				{#if pricingItem.features && pricingItem.features.length}
					<p class="my-1 ps-3 text-base font-medium text-zinc-950">Features</p>
					<div>
						<PricingFeatures bind:features={pricingItem.features} errors={errors?.features} />
					</div>
				{/if}
			</Card.Description>
		</div>
	</Card.Content>
</Card.Root>
