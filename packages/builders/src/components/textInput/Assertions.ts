import { TextInputStyle } from 'discord-api-types/v9';
import { z } from 'zod';
import { customIdValidator } from '../Assertions';

export const textInputStyleValidator = z.nativeEnum(TextInputStyle);
export const minLengthValidator = z.number().int().min(0).max(4000);
export const maxLengthValidator = z.number().int().min(1).max(4000);
export const requiredValidator = z.boolean();
export const valueValidator = z.string().max(4000);
export const placeholderValidator = z.string().max(100);
export const labelValidator = z.string().min(1).max(45);

export function validateRequiredParameters(customId?: string, style?: TextInputStyle, label?: string) {
	customIdValidator.parse(customId);
	textInputStyleValidator.parse(style);
	labelValidator.parse(label);
}
