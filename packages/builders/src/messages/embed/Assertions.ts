import { s } from '@sapphire/shapeshift';
import type { APIEmbedField } from 'discord-api-types/v10';

export const fieldNamePredicate = s.string.lengthGreaterThanOrEqual(1).lengthLessThanOrEqual(256);

export const fieldValuePredicate = s.string.lengthGreaterThanOrEqual(1).lengthLessThanOrEqual(1024);

export const fieldInlinePredicate = s.boolean.optional;

export const embedFieldPredicate = s.object({
	name: fieldNamePredicate,
	value: fieldValuePredicate,
	inline: fieldInlinePredicate,
});

export const embedFieldsArrayPredicate = embedFieldPredicate.array;

export const fieldLengthPredicate = s.number.lessThanOrEqual(25);

export function validateFieldLength(amountAdding: number, fields?: APIEmbedField[]): void {
	fieldLengthPredicate.parse((fields?.length ?? 0) + amountAdding);
}

export const authorNamePredicate = fieldNamePredicate.nullable;

export const imageURLPredicate = s.string.url({
	allowedProtocols: ['http:', 'https:', 'attachment:'],
}).nullish;

export const urlPredicate = s.string.url({
	allowedProtocols: ['http:', 'https:'],
}).nullish;

export const embedAuthorPredicate = s.object({
	name: authorNamePredicate,
	iconURL: imageURLPredicate,
	url: urlPredicate,
});

export const RGBPredicate = s.number.int.greaterThanOrEqual(0).lessThanOrEqual(255);
export const colorPredicate = s.number.int
	.greaterThanOrEqual(0)
	.lessThanOrEqual(0xffffff)
	.or(s.tuple([RGBPredicate, RGBPredicate, RGBPredicate])).nullable;

export const descriptionPredicate = s.string.lengthGreaterThanOrEqual(1).lengthLessThanOrEqual(4096).nullable;

export const footerTextPredicate = s.string.lengthGreaterThanOrEqual(1).lengthLessThanOrEqual(2048).nullable;

export const embedFooterPredicate = s.object({
	text: footerTextPredicate,
	iconURL: imageURLPredicate,
});

export const timestampPredicate = s.union(s.number, s.date).nullable;

export const titlePredicate = fieldNamePredicate.nullable;
