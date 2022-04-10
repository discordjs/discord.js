import { TextInputStyle } from 'discord-api-types/v10';
import { s } from '@sapphire/shapeshift';
import { customIdValidator } from '../Assertions';

export const textInputStyleValidator = s.nativeEnum(TextInputStyle);
export const minLengthValidator = s.number.int.ge(0).le(4000);
export const maxLengthValidator = s.number.int.ge(1).le(4000);
export const requiredValidator = s.boolean;
export const valueValidator = s.string.lengthLe(4000);
export const placeholderValidator = s.string.lengthLe(100);
export const labelValidator = s.string.lengthGe(1).lengthLe(45);

export function validateRequiredParameters(customId?: string, style?: TextInputStyle, label?: string) {
	customIdValidator.parse(customId);
	textInputStyleValidator.parse(style);
	labelValidator.parse(label);
}
