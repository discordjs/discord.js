import { s } from '@sapphire/shapeshift';
import { ComponentType } from 'discord-api-types/v10';
import { customIdValidator, idValidator } from '../Assertions.js';

export const fileUploadPredicate = s.object({
	type: s.literal(ComponentType.FileUpload),
	id: idValidator.optional(),
	custom_id: customIdValidator,
	min_values: s.number().greaterThanOrEqual(0).lessThanOrEqual(10).optional(),
	max_values: s.number().greaterThanOrEqual(1).lessThanOrEqual(10).optional(),
	required: s.boolean().optional(),
});
