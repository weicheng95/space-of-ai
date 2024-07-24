import { z } from 'zod';

const ACCEPTED_IMAGE_TYPES = [
	'image/jpeg',
	'image/jpg',
	'image/png',
	'image/webp',
	'image/svg+xml'
];

export const toolFormSchema = z.object({
	websiteUrl: z.string().url(),
	name: z.string().min(1, {
		message: 'Name is required'
	}),
	description: z
		.string()
		.min(1, {
			message: 'Description is required'
		})
		.max(1000),
	category: z.number().positive({
		message: 'Category is required'
	}),
	subcategories: z.string().array().min(1, 'At least one tag is required'),
	// who: z.string().min(1, {
	// 	message: 'field is required'
	// }),
	// what: z.string().min(1, {
	// 	message: 'field is required'
	// }),
	pricing: z
		.object({
			plan: z.string().min(1, { message: 'Plan name cannot be empty' }),
			price: z.coerce.number().gt(-1, 'Must be possitive number'),
			features: z.string().min(1, { message: 'feature cannot be empty' }).array().length(1, 'feature cannot be empty')
		})
		.array(),
	iconImage: z
		.instanceof(File, { message: 'Logo is required' })
		.refine((f) => f.size > 1024, 'Min 1KB upload size.')
		.refine((f) => f.size < 1_024_000, 'Max 1MB upload size.')
		.refine(
			(file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
			'Only .jpg, .jpeg, .png, .webp, .svg formats are supported.'
		),
	websiteImage: z
		.instanceof(File, { message: 'Website image is required' })
		.refine((f) => f.size > 1024, 'Min 1KB upload size.')
		.refine((f) => f.size < 3_072_000, 'Max 3MB upload size.')
		.refine(
			(file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
			'Only .jpg, .jpeg, .png, .webp, .svg formats are supported.'
		)
});

export type ToolFormSchema = typeof toolFormSchema;
