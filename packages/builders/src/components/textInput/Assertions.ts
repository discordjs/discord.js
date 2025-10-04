import { ComponentType, TextInputStyle } from 'discord-api-types/v10';
import { z } from 'zod';
import { customIdPredicate, idPredicate } from '../../Assertions.js';

export const textInputPredicate = z.object({
	id: idPredicate,
	type: z.literal(ComponentType.TextInput),
	custom_id: customIdPredicate,
	style: z.enum(TextInputStyle),
	min_length: z.number().min(0).max(4_000).optional(),
	max_length: z.number().min(1).max(4_000).optional(),
	placeholder: z.string().max(100).optional(),
	value: z.string().min(1).max(4_000).optional(),
	required: z.boolean().optional(),
});
