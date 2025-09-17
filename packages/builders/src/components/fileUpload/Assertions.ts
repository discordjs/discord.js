import { ComponentType } from 'discord-api-types/v10';
import { z } from 'zod';
import { customIdPredicate } from '../../Assertions';

export const fileUploadPredicate = z.object({
	type: z.literal(ComponentType.FileUpload),
	id: z.number().optional(),
	custom_id: customIdPredicate,
	min_values: z.number().min(0).max(10).optional(),
	max_values: z.number().min(1).max(10).optional(),
	required: z.boolean().optional(),
});
