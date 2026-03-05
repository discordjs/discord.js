import { ComponentType } from 'discord-api-types/v10';
import { z } from 'zod';
import { customIdPredicate, idPredicate } from '../../Assertions';

export const fileUploadPredicate = z.object({
	type: z.literal(ComponentType.FileUpload),
	id: idPredicate,
	custom_id: customIdPredicate,
	min_values: z.int().min(0).max(10).optional(),
	max_values: z.int().min(1).max(10).optional(),
	required: z.boolean().optional(),
});
