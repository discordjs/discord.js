import { s } from '@sapphire/shapeshift';
import { TextInputStyle } from 'discord-api-types/v10';
import { customIdValidator } from '../Assertions';

export const textInputStyleValidator = s.nativeEnum(TextInputStyle);
export const minLengthValidator = s.number.int.greaterThanOrEqual(0).lessThanOrEqual(4000);
export const maxLengthValidator = s.number.int.greaterThanOrEqual(1).lessThanOrEqual(4000);
export const requiredValidator = s.boolean;
export const valueValidator = s.string.lengthLessThanOrEqual(4000);
export const placeholderValidator = s.string.lengthLessThanOrEqual(100);
export const labelValidator = s.string.lengthGreaterThanOrEqual(1).lengthLessThanOrEqual(45);

export function validateRequiredParameters(customId?: string, style?: TextInputStyle, label?: string) {
	customIdValidator.parse(customId);
	textInputStyleValidator.parse(style);
	labelValidator.parse(label);
}
