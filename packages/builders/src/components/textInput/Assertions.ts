import { s } from '@sapphire/shapeshift';
import { TextInputStyle } from 'discord-api-types/v10';
import { isValidationEnabled } from '../../util/validation';
import { customIdValidator } from '../Assertions';

export const textInputStyleValidator = s.nativeEnum(TextInputStyle);
export const minLengthValidator = s.number.int
	.greaterThanOrEqual(0)
	.lessThanOrEqual(4000)
	.setValidationEnabled(isValidationEnabled);
export const maxLengthValidator = s.number.int
	.greaterThanOrEqual(1)
	.lessThanOrEqual(4000)
	.setValidationEnabled(isValidationEnabled);
export const requiredValidator = s.boolean;
export const valueValidator = s.string.lengthLessThanOrEqual(4000).setValidationEnabled(isValidationEnabled);
export const placeholderValidator = s.string.lengthLessThanOrEqual(100).setValidationEnabled(isValidationEnabled);
export const labelValidator = s.string
	.lengthGreaterThanOrEqual(1)
	.lengthLessThanOrEqual(45)
	.setValidationEnabled(isValidationEnabled);

export function validateRequiredParameters(customId?: string, style?: TextInputStyle, label?: string) {
	customIdValidator.parse(customId);
	textInputStyleValidator.parse(style);
	labelValidator.parse(label);
}
