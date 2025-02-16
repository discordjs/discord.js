import { z } from 'zod';
import { refineURLPredicate } from '../../Assertions';

const unfurledMediaItemPredicate = z.object({
	url: z
		.string()
		.url()
		.refine(refineURLPredicate(['http:', 'https:', 'attachment:']), {
			message: 'Invalid protocol for icon URL. Must be http:, https:, or attachment:',
		}),
});

export const thumbnailPredicate = z.object({
	media: unfurledMediaItemPredicate,
	description: z.string().min(1).max(1_024).nullish(),
	spoiler: z.boolean().optional(),
});
