import { TextInputStyle } from 'discord-api-types/v10';
import { z } from 'zod';
import { customIdValidator } from '../Assertions.js';

export const textInputStyleValidator = z.union([
	z.nativeEnum(TextInputStyle),
	z
		.enum(
			Object.values(TextInputStyle).filter((value) => typeof value === 'string') as [
				keyof typeof TextInputStyle,
				...(keyof typeof TextInputStyle)[],
			],
		)
		.transform((key) => TextInputStyle[key]),
]);
export const minLengthValidator = z.number().int().gte(0).lte(4_000);
export const maxLengthValidator = z.number().int().gte(1).lte(4_000);
export const requiredValidator = z.boolean();
export const valueValidator = z.string().max(4_000);
export const placeholderValidator = z.string().max(100);
export const labelValidator = z.string().min(1).max(45);

export function validateRequiredParameters(customId?: string, style?: TextInputStyle, label?: string) {
	customIdValidator.parse(customId);
	textInputStyleValidator.parse(style);
	labelValidator.parse(label);
}
