<script lang="ts">
	import { page } from '$app/stores';

	$: activatedRoute = $page.url.pathname;
</script>

<nav class="grid gap-4 text-sm text-muted-foreground">
	<a href="submit" class={activatedRoute === '/tools/submit' ? 'font-semibold text-primary' : ''}>
		Submit
	</a>
	<a href="my-tools" class={activatedRoute === '/tools/my-tools' ? 'font-semibold text-primary' : ''}
		>My Tools</a
	>
</nav>
