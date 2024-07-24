<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import type { HTMLAttributes } from 'svelte/elements';
	import { searchFormSchema, type SearchFormSchema } from '../home/schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Button } from '$lib/components/ui/button';
	import { LoaderCircle, Search } from 'lucide-svelte';
	import { cn } from '$lib/utils';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher<{
		submit: Infer<SearchFormSchema>;
		value: Infer<SearchFormSchema>;
	}>();

	export let isSubmitting: boolean;
	export let data: SuperValidated<Infer<SearchFormSchema>>;

	let className: HTMLAttributes<HTMLElement>['class'] = undefined;

	const form = superForm(data, {
		resetForm: true,
		validators: zodClient(searchFormSchema)
	});

	const { form: formData, errors } = form;

	const handleSubmit = async (event: Event) => {
		event.preventDefault();

		// Validate the form
		const validationResult = searchFormSchema.safeParse($formData);

		if (!validationResult.success) {
			// Handle validation errors
			errors.set(validationResult.error.flatten().fieldErrors);
			console.log('Validation errors:', validationResult.error.flatten().fieldErrors);
			return;
		}

		// if valid, pass to parent
		dispatch('submit', $formData);
	};

	const onQueryUpdate = async (query: string) => {
		dispatch('value', $formData);
	};

	$: $formData.query && onQueryUpdate($formData.query);

	export { className as class };
</script>

<form class={className} on:submit={handleSubmit}>
	<Form.Field {form} name="query" class="relative">
		<Form.Control let:attrs>
			<Form.Label></Form.Label>
			<Input
				{...attrs}
				bind:value={$formData.query}
				class={cn(
					'h-12 rounded-full border-none bg-zinc-80 px-8 ring-0 ring-transparent placeholder:font-normal placeholder:text-zinc-500  focus-visible:ring-0 focus-visible:ring-transparent'
				)}
				placeholder="I'm looking tool for content creation..."
				autocorrect="off"
				autocomplete="off"
				autosave="off"
			/>
			<Button
				disabled={$formData.query === ''}
				type="submit"
				variant="ghost"
				class="absolute -top-[0.1rem] end-4 space-x-2 rounded-full bg-black p-4 text-white transition-all hover:scale-105 hover:bg-black hover:text-white disabled:opacity-100"
			>
				{#if isSubmitting}
					<LoaderCircle size={18} class="animate-spin" color="white" strokeWidth="2" />
				{:else}
					<Search size={18} strokeWidth={2} class="text-white" />
					<span>Search with AI</span>
					<span class="sr-only">search</span>
				{/if}</Button
			>
		</Form.Control>
		<!-- <Form.FieldErrors /> -->
	</Form.Field>
</form>
