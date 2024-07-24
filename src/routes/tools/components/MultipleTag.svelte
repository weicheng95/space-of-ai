<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';
	import { X } from 'lucide-svelte';

	export let tags: string[] = [];
	export let maxTag = 5;

	const addTag = (e: any) => {
		if (tags.length >= maxTag) {
			e.preventDefault();
			return;
		}

		if (e.key === 'Enter') {
			e.preventDefault();

			if (!e.target.value) {
				return;
			}

			if (tags.some((t) => t === e.target.value)) {
				return;
			}
			tags = [...tags, e.target.value];
			// reset the field
			e.target.value = '';
		}
	};

	const removeTag = (e: any, tag: string) => {
		e.preventDefault();
		tags = tags.filter((t) => t !== tag);
	};
</script>

<Input on:keydown={(e) => addTag(e)} placeholder="Add up to 5 tags" />

<div class="flex flex-wrap gap-x-2">
	{#each tags as tag}
		<div class="flex w-fit items-center justify-center gap-x-2 rounded-full bg-gray-100 px-2 py-1 text-sm">
			{tag} <button type="button" on:click={(e) => removeTag(e, tag)}><X size={14} /></button>
		</div>
	{/each}
</div>
