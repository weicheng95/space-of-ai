<script lang="ts">
	import { page } from '$app/stores';
	import Logo from '$lib/components/icons/Logo.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Mail, Heart } from 'lucide-svelte';
</script>

<div class="bg-zinc-80 text-sm">
	<div
		class="container grid grid-cols-1 justify-center gap-y-8 py-10 sm:grid-cols-[1fr_1fr] md:grid-cols-[1fr_50%]"
	>
		<div>
			<a
				data-sveltekit-reload={$page.url.pathname === '/' ? true : false}
				href="/"
				class="mb-3 flex items-center gap-2 text-lg font-semibold md:text-base"
			>
				<Logo class="h-5 w-fit" />
				<span class="sr-only">Space of AI</span>
			</a>
			<p class="mb-1">© 2024 Space of AI. All rights reserved.</p>
			<p class="mb-3 text-sm sm:text-base">Explore, find, and utilize cutting-edge AI solutions.</p>
			<Button href="/tools/submit" class="text-xs sm:text-sm">Submit Tools</Button>
		</div>

		<div class="grid grid-cols-1 gap-y-8 sm:grid-cols-[1fr_1fr]">
			<div>
				<p class="mb-2 font-semibold">Resources</p>
				<ul class="space-y-1 font-normal">
					<li>Blog</li>
					<li>All Categories</li>
				</ul>
			</div>

			<div>
				<p class="mb-2 font-semibold">Support</p>
				<a href="mailto:support@spaceofai.tools" class="flex w-fit items-center gap-x-1 hover:underline">
					Contact us
				</a>
			</div>
		</div>
	</div>
</div>
<hr class="border-zinc-200" />

<div class="flex items-center justify-center bg-zinc-80 py-4">
	<p class="flex items-center gap-x-1 text-xs">
		Made with <Heart class="h-4 w-4 fill-red-600 stroke-red-600" /> by
		<a href="https://twitter.com/weicheng_95" target="_blank" rel="noopener" class="underline"
			>@weicheng95</a
		>
	</p>
</div>
