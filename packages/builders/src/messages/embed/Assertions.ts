import { s } from '@sapphire/shapeshift';
import type { APIEmbedField } from 'discord-api-types/v10';
import { isValidationEnabled } from '../../util/validation.js';

export const fieldNamePredicate = s.string
	.lengthGreaterThanOrEqual(1)
	.lengthLessThanOrEqual(256)
	.setValidationEnabled(isValidationEnabled);

export const fieldValuePredicate = s.string
	.lengthGreaterThanOrEqual(1)
	.lengthLessThanOrEqual(1_024)
	.setValidationEnabled(isValidationEnabled);

export const fieldInlinePredicate = s.boolean.optional;

export const embedFieldPredicate = s
	.object({
		name: fieldNamePredicate,
		value: fieldValuePredicate,
		inline: fieldInlinePredicate,
	})
	.setValidationEnabled(isValidationEnabled);

export const embedFieldsArrayPredicate = embedFieldPredicate.array.setValidationEnabled(isValidationEnabled);

export const fieldLengthPredicate = s.number.lessThanOrEqual(25).setValidationEnabled(isValidationEnabled);

export function validateFieldLength(amountAdding: number, fields?: APIEmbedField[]): void {
	fieldLengthPredicate.parse((fields?.length ?? 0) + amountAdding);
}

export const authorNamePredicate = fieldNamePredicate.nullable.setValidationEnabled(isValidationEnabled);

export const imageURLPredicate = s.string
	.url({
		allowedProtocols: ['http:', 'https:', 'attachment:'],
	})
	.nullish.setValidationEnabled(isValidationEnabled);

export const urlPredicate = s.string
	.url({
		allowedProtocols: ['http:', 'https:'],
	})
	.nullish.setValidationEnabled(isValidationEnabled);

export const embedAuthorPredicate = s
	.object({
		name: authorNamePredicate,
		iconURL: imageURLPredicate,
		url: urlPredicate,
	})
	.setValidationEnabled(isValidationEnabled);

export const RGBPredicate = s.number.int
	.greaterThanOrEqual(0)
	.lessThanOrEqual(255)
	.setValidationEnabled(isValidationEnabled);
export const colorPredicate = s.number.int
	.greaterThanOrEqual(0)
	.lessThanOrEqual(0xffffff)
	.or(s.tuple([RGBPredicate, RGBPredicate, RGBPredicate]))
	.nullable.setValidationEnabled(isValidationEnabled);

export const descriptionPredicate = s.string
	.lengthGreaterThanOrEqual(1)
	.lengthLessThanOrEqual(4_096)
	.nullable.setValidationEnabled(isValidationEnabled);

export const footerTextPredicate = s.string
	.lengthGreaterThanOrEqual(1)
	.lengthLessThanOrEqual(2_048)
	.nullable.setValidationEnabled(isValidationEnabled);

export const embedFooterPredicate = s
	.object({
		text: footerTextPredicate,
		iconURL: imageURLPredicate,
	})
	.setValidationEnabled(isValidationEnabled);

export const timestampPredicate = s.union(s.number, s.date).nullable.setValidationEnabled(isValidationEnabled);

export const titlePredicate = fieldNamePredicate.nullable.setValidationEnabled(isValidationEnabled);
