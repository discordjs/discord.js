import type { APIEmbedField } from 'discord-api-types/v10';
import { z } from 'zod';

export const fieldNamePredicate = z.string().min(1).max(256);

export const fieldValuePredicate = z.string().min(1).max(1_024);

export const fieldInlinePredicate = z.boolean().optional();

export const embedFieldPredicate = z.object({
	name: fieldNamePredicate,
	value: fieldValuePredicate,
	inline: fieldInlinePredicate,
});

export const embedFieldsArrayPredicate = embedFieldPredicate.array();

export const fieldLengthPredicate = z.number().max(25);

export function validateFieldLength(amountAdding: number, fields?: APIEmbedField[]): void {
	fieldLengthPredicate.parse((fields?.length ?? 0) + amountAdding);
}

export const authorNamePredicate = fieldNamePredicate.nullable();

export const imageURLPredicate = z
	.string()
	.url()
	.regex(/^(?<proto>https?|attachment):\/\//)
	.nullish();

export const urlPredicate = z
	.string()
	.url()
	.regex(/^https?:\/\//)
	.nullish();

export const embedAuthorPredicate = z.object({
	name: authorNamePredicate,
	iconURL: imageURLPredicate,
	url: urlPredicate,
});

export const RGBPredicate = z.number().int().min(0).max(255);
export const colorPredicate = z
	.number()
	.int()
	.min(0)
	.max(0xffffff)
	.or(z.tuple([RGBPredicate, RGBPredicate, RGBPredicate]))
	.nullable();

export const descriptionPredicate = z.string().min(1).max(4_096).nullable();

export const footerTextPredicate = z.string().min(1).max(2_048).nullable();

export const embedFooterPredicate = z.object({
	text: footerTextPredicate,
	iconURL: imageURLPredicate,
});

export const timestampPredicate = z.union([z.number(), z.date()]).nullable();

export const titlePredicate = fieldNamePredicate.nullable();
