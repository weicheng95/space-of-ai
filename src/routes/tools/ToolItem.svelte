<script lang="ts">
	import type { Product } from '$lib/types/product';
	import { ExternalLink } from 'lucide-svelte';

	export let product: Product;
</script>

<div class="flex gap-x-4 rounded-xl bg-zinc-80 p-4 transition-all hover:scale-105">
	<a
		href="tools/{product.id}"
		class="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-white sm:h-16 sm:w-16"
	>
		<img
			src={'https://static.spaceofai.tools/' + product.icon_url}
			alt={product.name}
			class="h-6 w-6 flex-none rounded-lg object-contain sm:h-10 sm:w-10"
		/>
	</a>

	<div class="w-full">
		<h4 class="w-full text-base font-semibold sm:text-lg">
			<a
				class="font-medium hover:underline"
				href="tools/{product.id}-{product.name.replace(/ |_/g, '-')}"
				target="_blank"
				rel="noopener">{product.name}</a
			>

			<a
				class="float-right inline-block"
				href={product.url + '?ref=spaceofai&utm_source=spaceofai&utm_medium=referral'}
				target="_blank"
			>
				<ExternalLink size={14} />
			</a>
		</h4>
		<p class="mb-4 text-xs text-gray-600">
			<a
				href="/tools/categories/{product?.categories?.id}-{product?.categories?.name}"
				class="hover:underline">{product?.categories?.name}</a
			>
		</p>
		<p class="line-clamp-3 text-xs font-normal leading-5 text-primary sm:text-sm">
			{product.description || ''}
		</p>
	</div>
</div>
