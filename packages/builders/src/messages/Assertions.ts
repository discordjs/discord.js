import { z } from 'zod';

export const attachmentPredicate = z.object({
	id: z.union([z.string(), z.number()]),
	description: z.string().optional(),
	duration_secs: z.number().optional(),
	filename: z.string().optional(),
	title: z.string().optional(),
	waveform: z.string().optional(),
});
