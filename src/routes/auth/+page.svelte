<script lang="ts">
	import Google from '$lib/components/icons/Google.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { cn } from '$lib/utils';
</script>

<main class="container flex h-[calc(100dvh-5rem)] items-center justify-center">
	<Card.Root class="w-full max-w-sm">
		<Card.Header>
			<Card.Title class="text-center text-2xl">Login to continue</Card.Title>
		</Card.Header>
		<Card.Content class="grid gap-4">
			<Button
				variant="link"
				class={cn('space-x-2 border border-gray-300 py-5')}
				href="/login/google"
			>
				<Google class="h-6 w-6" />
				<span>Sign in with Google</span>
			</Button>
		</Card.Content>
	</Card.Root>
</main>
