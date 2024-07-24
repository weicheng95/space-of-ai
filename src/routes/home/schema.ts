import { z } from 'zod';

export const searchFormSchema = z.object({
	query: z.string().min(2).max(50)
});

export type SearchFormSchema = typeof searchFormSchema;
