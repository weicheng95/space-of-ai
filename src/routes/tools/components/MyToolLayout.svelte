<!-- src/routes/+layout.svelte -->
<script lang="ts">
	import ToolSideNav from './ToolSideNav.svelte';
</script>

<svelte:head>
	<title>My Tools - Space of AI</title>
</svelte:head>

<main class="container py-8">
	<div class="mb-8">
		<h1 class="text-3xl font-semibold">Tools</h1>
	</div>
	<div class="mx-auto grid w-full grid-flow-row sm:grid-flow-col sm:grid-cols-[180px_1fr] items-start gap-6 lg:grid-cols-[250px_1fr]">
		<ToolSideNav />

		<slot />
	</div>
</main>
