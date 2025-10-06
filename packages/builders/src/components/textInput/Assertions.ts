import { s } from '@sapphire/shapeshift';
import { ComponentType, TextInputStyle } from 'discord-api-types/v10';
import { isValidationEnabled } from '../../util/validation.js';
import { customIdValidator, idValidator } from '../Assertions.js';

export const textInputStyleValidator = s.nativeEnum(TextInputStyle).setValidationEnabled(isValidationEnabled);
export const minLengthValidator = s
	.number()
	.int()
	.greaterThanOrEqual(0)
	.lessThanOrEqual(4_000)
	.setValidationEnabled(isValidationEnabled);
export const maxLengthValidator = s
	.number()
	.int()
	.greaterThanOrEqual(1)
	.lessThanOrEqual(4_000)
	.setValidationEnabled(isValidationEnabled);
export const requiredValidator = s.boolean().setValidationEnabled(isValidationEnabled);
export const valueValidator = s.string().lengthLessThanOrEqual(4_000).setValidationEnabled(isValidationEnabled);
export const placeholderValidator = s.string().lengthLessThanOrEqual(100).setValidationEnabled(isValidationEnabled);
export const labelValidator = s
	.string()
	.lengthGreaterThanOrEqual(1)
	.lengthLessThanOrEqual(45)
	.setValidationEnabled(isValidationEnabled);

export const textInputPredicate = s
	.object({
		type: s.literal(ComponentType.TextInput),
		custom_id: customIdValidator,
		style: textInputStyleValidator,
		id: idValidator.optional(),
		min_length: minLengthValidator.optional(),
		max_length: maxLengthValidator.optional(),
		placeholder: placeholderValidator.optional(),
		value: valueValidator.optional(),
		required: requiredValidator.optional(),
	})
	.setValidationEnabled(isValidationEnabled);

export function validateRequiredParameters(customId?: string, style?: TextInputStyle) {
	customIdValidator.parse(customId);
	textInputStyleValidator.parse(style);
}
