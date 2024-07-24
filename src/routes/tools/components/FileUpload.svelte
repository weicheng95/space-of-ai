<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import FileInput from '$lib/components/ui/input/file-input.svelte';
	import { X } from 'lucide-svelte';

	export let file: any;
	export let hint: string;
	export let attrs: HTMLInputAttributes;
	let el: any;
	let reload = false;

	export let thumbnail: any;
	
	const readFile = (event: any) => {
		const file =
			event?.target?.files.length > 0 ? event?.target?.files[0] : event?.target?.files[0];
		if (!file) return;
		thumbnail = URL.createObjectURL(file);
	};

	const removeFile = (e: any) => {
		e.preventDefault();
		e.stopPropagation();
		file.set(null);
		el.value = '';
		thumbnail = '';
		reload = true;
		setTimeout(() => {
			reload = false;
		});
	};
</script>

<div>
	{#if !reload}
		<div class="relative">
			<FileInput
				bind:this={el}
				placeholder="Name"
				{...attrs}
				type="file"
				bind:files={$file}
				on:change={readFile}
			/>

			{#if $file && $file.length > 0}
				<button class="absolute bottom-0 end-2 top-0" on:click={removeFile}>
					<X size="16" /></button
				>
			{/if}
		</div>

		{#if hint}
			<span class="hint text-sm text-gray-400">
				{hint}
			</span>
		{/if}

		<slot></slot>
	{/if}
</div>
