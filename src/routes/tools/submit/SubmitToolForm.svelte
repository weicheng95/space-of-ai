<script lang="ts">
	import SuperDebug, {
		superForm,
		type Infer,
		type SuperValidated,
		fileProxy
	} from 'sveltekit-superforms';
	import { toolFormSchema, type ToolFormSchema } from '../schema';
	import * as Form from '$lib/components/ui/form';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import FileUpload from '../components/FileUpload.svelte';
	import * as Popover from '$lib/components/ui/popover';
	import * as Command from '$lib/components/ui/command';
	import { cn } from '$lib/utils';
	import { buttonVariants } from '$lib/components/ui/button';
	import type { Category } from '$lib/types/product';
	import CaretSort from 'svelte-radix/CaretSort.svelte';
	import { getContext, setContext, tick } from 'svelte';
	import { Check } from 'svelte-radix';
	import MultipleTag from '../components/MultipleTag.svelte';
	import { Switch } from '$lib/components/ui/switch';
	import { Label } from '$lib/components/ui/label';
	import PricingList from '../components/PricingList.svelte';
	import { writable } from 'svelte/store';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import { Loader2 } from 'lucide-svelte';

	export let data: SuperValidated<Infer<ToolFormSchema>>;
	export let categories: Category[] = [];
	let iconImageThumbnail: string | undefined = undefined;
	let websiteImageThumbnail: string | undefined = undefined;
	let categoryOpen = false;
	let isFree = writable(true);

	const form = superForm(data, {
		validators: zodClient(toolFormSchema),
		dataType: 'json'
	});

	const { form: formData, enhance, errors, restore, submitting, reset, submit, message } = form;
	const iconImage = fileProxy(form, 'iconImage');
	const websiteImage = fileProxy(form, 'websiteImage');

	$: if ($message) {
		if ($message === 'success') {
			toast.success(
				'The tool has been submitted; we will review it and upload it to the platform as soon as possible.'
			);

			reset();
			setTimeout(() => {
				goto('my-tools');
			}, 1000);
		}
	}

	const closeAndFocusTrigger = (triggerId: string) => {
		categoryOpen = false;
		tick().then(() => {
			document.getElementById(triggerId)?.focus();
		});
	};

	// prefill for testing
	// formData.set({
	// 	websiteUrl: 'https://www.google.com',
	// 	name: 'Google',
	// 	iconImage: new File([], 'google.png', { type: 'image/png' }),
	// 	websiteImage: new File([], 'google.png', { type: 'image/png' }),
	// 	category: 10148921,
	// 	description: 'Search engine',
	// 	subcategories: ['google'],
	// 	pricing: []
	// });

	isFree.subscribe((value) => {
		console.log(value);
		if (!!value) {
			formData.update((data) => {
				data.pricing = [];
				return data;
			});
		} else {
			formData.update((data) => {
				data.pricing = [
					{
						plan: '',
						features: [''],
						price: 0
					}
				];
				return data;
			});
		}
	});
</script>

<form method="POST" use:enhance class="space-y-10" enctype="multipart/form-data" action="?/submit">
	<Form.Field {form} name="websiteUrl">
		<Form.Control let:attrs>
			<Form.Label>Website</Form.Label>
			<Input placeholder="Website url" type="url" {...attrs} bind:value={$formData.websiteUrl} />
		</Form.Control>
		<Form.Description />
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="name">
		<Form.Control let:attrs>
			<Form.Label>Name</Form.Label>
			<Input placeholder="Name" {...attrs} bind:value={$formData.name} />
		</Form.Control>
		<Form.Description />
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="iconImage">
		<Form.Control let:attrs>
			<Form.Label>Logo</Form.Label>
			<FileUpload
				bind:thumbnail={iconImageThumbnail}
				attrs={{ ...attrs, accept: 'image/jpeg,image/jpg,image/png,image/webp,image/svg+xml' }}
				file={iconImage}
				hint="Suggested size: 512x512 pixels. Only png, jpeg, webp and svg are supported."
			>
				{#if iconImageThumbnail}
					<div class="my-4">
						<img
							class="h-20 w-20 rounded-full border border-gray-200 object-cover"
							src={iconImageThumbnail}
							alt="icon"
							loading="lazy"
						/>
					</div>
				{/if}
			</FileUpload>
		</Form.Control>
		<Form.Description />
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="websiteImage">
		<Form.Control let:attrs>
			<Form.Label>Website Image</Form.Label>
			<FileUpload
				bind:thumbnail={websiteImageThumbnail}
				attrs={{ ...attrs, accept: 'image/jpeg,image/jpg,image/png,image/webp,image/svg+xml' }}
				file={websiteImage}
				hint="Recommended minimum dimensions: 1600x834 pixels. Only png, jpeg, webp and svg are supported."
			>
				{#if websiteImageThumbnail}
					<div class="my-4">
						<img
							class="h-[417px] w-full rounded-xl border border-gray-200 object-cover"
							src={websiteImageThumbnail}
							alt="icon"
							loading="lazy"
						/>
					</div>
				{/if}
			</FileUpload>
		</Form.Control>
		<Form.Description />
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="description">
		<Form.Control let:attrs>
			<Form.Label>Description</Form.Label>
			<Textarea
				{...attrs}
				rows={6}
				placeholder="Tell us more about your tool"
				class="resize-none"
				bind:value={$formData.description}
			/>
		</Form.Control>
		<Form.Description />
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="category" class="flex flex-col">
		<Popover.Root let:ids>
			<Form.Control let:attrs>
				<Form.Label>Category</Form.Label>
				<Popover.Trigger
					class={cn(
						buttonVariants({ variant: 'outline' }),
						'w-[200px] justify-between',
						!$formData.category && 'text-muted-foreground'
					)}
					role="combobox"
					{...attrs}
				>
					{categories.find((f) => f.id === $formData.category)?.name ?? 'Select category'}

					<CaretSort class="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Popover.Trigger>
				<input hidden value={$formData.category} name={attrs.name} />
			</Form.Control>
			<Popover.Content class="w-[250px] p-0">
				<Command.Root>
					<Command.Input autofocus placeholder="Search category..." class="h-9" />
					<Command.Empty>No category found.</Command.Empty>
					<Command.Group class="max-h-80 overflow-auto">
						{#each categories as category}
							<Command.Item
								value={category.name}
								onSelect={() => {
									$formData.category = categories.find((f) => f.name === category.name)?.id || 0;
									closeAndFocusTrigger(ids.trigger);
								}}
							>
								{category.name}
								<Check
									class={cn(
										'ml-auto h-4 w-4',
										category.id !== $formData.category && 'text-transparent'
									)}
								/>
							</Command.Item>
						{/each}
					</Command.Group>
				</Command.Root>
			</Popover.Content>
		</Popover.Root>
		<Form.Description />
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="subcategories" class="flex flex-col">
		<Form.Control let:attrs>
			<Form.Label>Tags</Form.Label>
			<MultipleTag {...attrs} bind:tags={$formData.subcategories} />
			<input hidden value={$formData.subcategories} name={attrs.name} />
		</Form.Control>

		<Form.Description />
		<Form.FieldErrors />
	</Form.Field>

	<div class="flex items-center space-x-2">
		<Switch id="free-mode" bind:checked={$isFree} />
		<Label for="free-mode">Free</Label>
	</div>

	{#if !$isFree}
		<Form.Field {form} name="pricing" class="flex flex-col">
			<Form.Control let:attrs>
				<Form.Label>Pricing</Form.Label>
				<PricingList {...attrs} errors={$errors.pricing} bind:priceList={$formData.pricing} />
				<input hidden value={$formData.pricing} name={attrs.name} />
			</Form.Control>

			<Form.Description />
			<Form.FieldErrors />
		</Form.Field>
	{/if}

	<Form.Button>
		{#if $submitting}
			<Loader2 class="mr-2 h-4 w-4 animate-spin" />
		{/if}
		Submit
	</Form.Button>
</form>
