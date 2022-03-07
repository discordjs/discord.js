import type { APIEmbedField } from 'discord-api-types/v9';
import { s } from '@sapphire/shapeshift';

export const fieldNamePredicate = s.string.lengthGe(1).lengthLe(256);

export const fieldValuePredicate = s.string.lengthGe(1).lengthLe(1024);

export const fieldInlinePredicate = s.boolean.optional;

export const embedFieldPredicate = s.object({
	name: fieldNamePredicate,
	value: fieldValuePredicate,
	inline: fieldInlinePredicate,
});

export const embedFieldsArrayPredicate = embedFieldPredicate.array;

export const fieldLengthPredicate = s.number.le(25);

export function validateFieldLength(amountAdding: number, fields?: APIEmbedField[]): void {
	fieldLengthPredicate.parse((fields?.length ?? 0) + amountAdding);
}

export const authorNamePredicate = fieldNamePredicate.nullable;

export const urlPredicate =
	// TODO: after v2
	// .url()
	s.string.nullish;

export const RGBPredicate = s.number.int.ge(0).le(255);
export const colorPredicate = s.number.int.ge(0).le(0xffffff).nullable;
// TODO: after v2
// .or(s.tuple(RGBPredicate, RGBPredicate, RGBPredicate));

export const descriptionPredicate = s.string.lengthGe(1).lengthLe(4096).nullable;

export const footerTextPredicate = s.string.lengthGe(1).lengthLe(2048).nullable;

// TODO: after v2
// @ts-expect-error
export const timestampPredicate = s.union(s.number, s.date).nullable;

export const titlePredicate = fieldNamePredicate.nullable;
