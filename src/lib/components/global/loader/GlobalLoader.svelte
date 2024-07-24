<script lang="ts">
	import { LoaderCircle } from 'lucide-svelte';
</script>

<div class="fixed left-0 top-0 z-[100] flex h-full w-full items-center justify-center">
	<div class="fixed h-full w-full bg-black opacity-50"></div>
	<LoaderCircle class="h-9 w-9 animate-spin" color="white" strokeWidth="2" />
</div>
