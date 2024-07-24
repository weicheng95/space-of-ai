<script lang="ts">
	import { PUBLIC_BUCKET_URL } from '$env/static/public';
	import { Badge } from '$lib/components/ui/badge';
	import type { Product } from '$lib/types/product';
	import { cn } from '$lib/utils';

	export let product: Product;

	$: badgeColor = product.status_type === 'draft' ? 'bg-' : '';

	const convertStatus = (status?: string) => {
		switch (status) {
			case 'draft':
				return 'Pending review';
			default:
				return status;
		}
	}
</script>

<div class="flex items-start gap-x-4">
	<div class="flex h-16 w-16 flex-none items-center justify-center rounded-xl bg-gray-100">
		<img
			src={`${PUBLIC_BUCKET_URL}/${product.icon_url}`}
			alt={product.name}
			class="h-10 w-10 flex-none rounded-lg object-contain"
		/>
	</div>

	<div class="w-full">
		<h4 class="w-full text-lg font-semibold">
			{product.name}
		</h4>
		<p class="mb-3 text-xs text-gray-600">
			{product?.categories?.name}
		</p>
		<p class="line-clamp-4 text-sm">
			{product.description || ''}
		</p>
	</div>

	<div class="status self-center">
		<Badge
			class="badge-{product.status_type} {cn('self-center rounded-full font-normal shadow-none whitespace-nowrap')}"
			>{convertStatus(product.status_type)}</Badge
		>
	</div>
</div>

<style lang="scss">
	.status {
		:global(.badge-active) {
			@apply bg-green-200 text-green-900 hover:bg-green-200;
		}

		:global(.badge-draft) {
			@apply bg-zinc-80 text-slate-800 hover:bg-zinc-80;
		}
	}
</style>
