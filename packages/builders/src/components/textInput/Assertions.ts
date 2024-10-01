import { ComponentType, TextInputStyle } from 'discord-api-types/v10';
import { z } from 'zod';
import { customIdPredicate } from '../../Assertions.js';

export const textInputPredicate = z.object({
	type: z.literal(ComponentType.TextInput),
	custom_id: customIdPredicate,
	label: z.string().min(1).max(45),
	style: z.nativeEnum(TextInputStyle),
	min_length: z.number().min(0).max(4_000).optional(),
	max_length: z.number().min(1).max(4_000).optional(),
	placeholder: z.string().max(100).optional(),
	value: z.string().max(4_000).optional(),
	required: z.boolean().optional(),
});
