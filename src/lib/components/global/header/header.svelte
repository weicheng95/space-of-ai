<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/';
	import { Menu, Package2, User } from 'lucide-svelte';
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import * as Avatar from '$lib/components/ui/avatar';
	import { cn } from '$lib/utils';
	import SubmitIcon from '$lib/components/icons/Submit.svelte';
	import { CirclePlus } from 'lucide-svelte';
	import Logo from '$lib/components/icons/Logo.svelte';
	import LogoNoName from '$lib/components/icons/LogoNoName.svelte';
	$: user = $page.data.user;
</script>

<header class="sticky top-0 z-10 items-center border-b bg-background">
	<div class="container flex h-16 items-center justify-between gap-4">
		<nav
			class="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6"
		>
			<a
				data-sveltekit-reload={$page.url.pathname === '/' ? true : false}
				href="/"
				class="flex items-center gap-2 text-lg font-semibold md:text-base"
			>
				<Logo class="h-7 w-fit" />
				<span class="sr-only">Space of AI</span>
			</a>

			<!-- <a href="##" class="text-muted-foreground transition-colors hover:text-foreground">
			Dashboard
		</a>
		<a href="##" class="text-muted-foreground transition-colors hover:text-foreground"> Orders </a>
		<a href="##" class="text-muted-foreground transition-colors hover:text-foreground">
			Products
		</a>
		<a href="##" class="text-muted-foreground transition-colors hover:text-foreground">
			Customers
		</a>
		<a href="##" class="text-foreground transition-colors hover:text-foreground"> Settings </a> -->
		</nav>

		<!-- mobile logo  -->
		<a data-sveltekit-reload={$page.url.pathname === '/' ? true : false} href="/">
			<LogoNoName class="h-auto w-5 sm:hidden" />
		</a>

		<!-- <Sheet.Root>
			<Sheet.Trigger asChild let:builder>
				<Button variant="outline" size="icon" class="shrink-0 md:hidden" builders={[builder]}>
					<Menu class="h-5 w-5" />
					<span class="sr-only">Toggle navigation menu</span>
				</Button>
			</Sheet.Trigger>
			<Sheet.Content side="left">
				<nav class="grid gap-6 text-lg font-medium">
					<a href="##" class="flex items-center gap-2 text-lg font-semibold">
						<Package2 class="h-6 w-6" />
						<span class="sr-only">Acme Inc</span>
					</a>
					<a href="##" class="text-muted-foreground hover:text-foreground"> Dashboard </a>
					<a href="##" class="text-muted-foreground hover:text-foreground"> Orders </a>
					<a href="##" class="text-muted-foreground hover:text-foreground"> Products </a>
					<a href="##" class="text-muted-foreground hover:text-foreground"> Customers </a>
					<a href="##" class="hover:text-foreground"> Settings </a>
				</nav>
			</Sheet.Content>
		</Sheet.Root> -->
		<div class="flex w-auto items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
			<Button
				variant="link"
				href={user ? '/tools/submit' : '/auth'}
				class="gap-x-2 px-1 text-sm hover:text-teal-500 sm:space-x-4 sm:text-sm"
			>
				<!-- <SubmitIcon class="w-5 h-auto" /> -->
				<CirclePlus size="16" />
				Submit Tool</Button
			>

			<DropdownMenu.Root>
				<DropdownMenu.Trigger asChild let:builder>
					<Button
						builders={[builder]}
						variant="secondary"
						size="icon"
						class="h-fit w-fit rounded-full"
					>
						{#if user}
							<Avatar.Root class="h-7 w-7 sm:h-8 sm:w-8">
								<Avatar.Image src={user.image} alt={user.username} />
								<Avatar.Fallback>{user.username.slice(0, 1)}</Avatar.Fallback>
							</Avatar.Root>
						{:else}
							<User class="h-7 w-7 p-1.5 sm:h-8 sm:w-8" />
						{/if}

						<span class="sr-only">Toggle user menu</span>
					</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="end">
					{#if !user}
						<DropdownMenu.Item class="menu-item" href="/auth">
							<Button variant="ghost" class={cn('menu-button')}>Login</Button>
						</DropdownMenu.Item>
						<DropdownMenu.Separator />
					{/if}
					<DropdownMenu.Item class="menu-item">
						<Button variant="ghost" class={cn('menu-button')} href="mailto:support@spaceofai.tools">Support</Button>
					</DropdownMenu.Item>
					{#if user}
						<DropdownMenu.Separator />

						<DropdownMenu.Item class="menu-item">
							<form method="post" action="?/logout" use:enhance class="w-full">
								<Button type="submit" variant="ghost" class={cn('menu-button')}>Logout</Button>
							</form>
						</DropdownMenu.Item>
					{/if}
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
	</div>
</header>

<style lang="scss">
	:global(.menu-item) {
		@apply p-0;
	}
	:global(.menu-button) {
		@apply h-auto w-full justify-start p-0 px-2 py-2 font-normal;
	}
</style>
