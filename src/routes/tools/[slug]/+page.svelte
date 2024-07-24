<!-- src/routes/+page.svelte -->
<script lang="ts">
	import type { PageData } from './$types';
	import type { ProductDetail } from '$lib/types/product';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import * as Card from '$lib/components/ui/card';
	import { ExternalLink, Loader2 } from 'lucide-svelte';
	import Seo from '$lib/components/global/seo/Seo.svelte';
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import { PUBLIC_BUCKET_URL, PUBLIC_WEBSITE_URL } from '$env/static/public';
	export let data: PageData;

	let product: ProductDetail | null = $page.data.product || null;
	let breadcrumbs: any = [];
	breadcrumbs = [
		{
			name: 'Home',
			slug: ''
		},
		{
			name: 'Tool',
			slug: `tools/${$page.params.slug}-${product && product.name?.replace(/ |_/g, '-')}`
		}
	];
</script>

<Seo
	title={product?.name}
	slug={$page.params.slug}
	url={PUBLIC_WEBSITE_URL + '/' + breadcrumbs[1].slug}
	image={PUBLIC_BUCKET_URL + '/' + product?.website_image_url}
	description={product?.description}
	articleKeywords={product?.subcategory?.join(',')}
	{breadcrumbs}
/>

{#if !product}
	<div class="flex h-[calc(100dvh-5rem)] items-center justify-center">
		<Loader2 class="mr-2 h-8 w-8 animate-spin" />
	</div>
{:else}
	<main class="container py-8">
		<div class="tool-header mb-6">
			<div class="flex justify-between">
				<h1 class="mb-1 text-2xl font-semibold">
					{product.name}
				</h1>

				<a
					class="float-right inline-block transition-all hover:scale-105"
					href={product.url + '?ref=spaceofai&utm_source=spaceofai&utm_medium=referral'}
					target="_blank"
				>
					<ExternalLink size={18} />
				</a>
			</div>

			<Button
				class="mb-4 h-auto p-0 text-sm"
				variant="link"
				href={`/tools/categories/${product?.categories.id}-${encodeURIComponent(product?.categories.name)}`}
				>{product?.categories?.name}</Button
			>
		</div>

		{#if product?.website_image_url}
			<div class="rounded-xl bg-transparent shadow-xl">
				<img
					src={'https://static.spaceofai.tools/' + product?.website_image_url}
					alt={product?.name}
					class="h-auto w-full rounded-xl"
				/>
				<!-- <div
					class="flex h-[40rem] w-full items-center justify-center rounded-xl bg-contain bg-no-repeat bg-black bg-center"
					style="background-image: url({'https://static.spaceofai.tools/' +
						product.website_image_url});"
				></div> -->
			</div>
		{/if}

		<div class="my-16">
			<div class="mb-6">
				<h3 class="mb-2 text-xl font-medium">Description</h3>
				<p class="leading-7 text-primary">{product.description}</p>
			</div>

			<div class="grid gap-4 md:grid-cols-3">
				<Card.Root class="rounded-xl shadow-none">
					<Card.Content class="h-full  rounded-xl border-none py-6">
						<div class="grid gap-2">
							<Card.Title class="text-lg font-medium">What is this for?</Card.Title>
							<Card.Description class="font-normal leading-6 text-primary"
								>{product?.meta?.what || ''}</Card.Description
							>
						</div>
					</Card.Content>
				</Card.Root>

				<Card.Root class="rounded-xl shadow-none">
					<Card.Content class="h-full  rounded-xl border-none py-6">
						<div class="grid gap-2">
							<Card.Title class="text-lg font-medium">Who is this for?</Card.Title>
							<Card.Description class="font-normal leading-6 text-primary"
								>{product?.meta?.who || ''}</Card.Description
							>
						</div>
					</Card.Content>
				</Card.Root>

				{#if product?.meta?.best_features}
					<Card.Root class="col-span-1 rounded-xl shadow-none">
						<Card.Content class="h-full  rounded-xl border-none py-6">
							<div class="grid gap-2">
								<Card.Title class="text-lg font-medium">Best Features</Card.Title>
								<ul class="space-y-2">
									{#each product?.meta?.best_features as feature}
										<li class="ms-4 list-disc text-sm font-normal leading-6 text-primary">
											{feature}
										</li>
									{/each}
								</ul>
							</div>
						</Card.Content>
					</Card.Root>
				{/if}
			</div>

			{#if product?.meta?.pricing && product?.meta?.pricing.length}
				<Separator class="my-8" />
				<div>
					<h4 class="mb-3 text-xl font-medium">Pricing</h4>
					<div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
						{#each product?.meta?.pricing || [] as pricing}
							<Card.Root>
								<Card.Content class="py-6">
									<div class="grid gap-1">
										<Card.Title class="text-sm font-medium text-primary">{pricing?.plan}</Card.Title
										>
										<Card.Description>
											{#if pricing.price !== undefined}
												<div class="mb-4 text-xl font-semibold text-primary">
													${pricing.price || 0}
												</div>
											{/if}
											{#if pricing.features && pricing.features.length}
												<div>
													<p class="mb-1 text-sm font-medium text-primary">Features</p>
													<ul>
														{#each pricing.features as feature}
															<li class="ms-4 list-disc text-xs font-normal leading-6 text-primary">
																{feature}
															</li>
														{/each}
													</ul>
												</div>
											{/if}
										</Card.Description>
									</div>
								</Card.Content>
							</Card.Root>
						{/each}
					</div>
				</div>
			{/if}
		</div>

		<Separator />
	</main>
{/if}
