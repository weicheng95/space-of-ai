<script lang="ts">
	import { Input } from '$lib/components/ui/input';

	export let feature: string;
	export let errors: any;
</script>

<div class="flex-1">
	<Input
		data-invalid={errors}
		placeholder="Top feature"
		bind:value={feature}
		class="h-auto w-full border-transparent py-1 text-zinc-950 shadow-none hover:border hover:border-solid hover:border-zinc-950"
	/>

	{#if errors}
		<span class="invalid ps-3 text-xs text-red-500">{errors}</span>
	{/if}
</div>
