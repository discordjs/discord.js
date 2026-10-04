import { Locale } from 'discord-api-types/v10';
import { z } from 'zod';

export const idPredicate = z.int().min(0).max(2_147_483_647).optional();
export const customIdPredicate = z.string().min(1).max(100);
export const snowflakePredicate = z.string().regex(/^(?:0|[1-9]\d*)$/);

export const fileUploadTypesPredicate = z
	.union([z.enum(['audio', 'image', 'video']), z.string().min(2).startsWith('.')])
	.array()
	.max(10);

export const memberPermissionsPredicate = z.coerce.bigint();

export const localeMapPredicate = z.strictObject(
	Object.fromEntries(Object.values(Locale).map((loc) => [loc, z.string().optional()])) as Record<
		Locale,
		z.ZodOptional<z.ZodString>
	>,
);

export interface CheckMinMaxFieldsOptions {
	maxFieldName: string;
	message: string;
	minFieldName: string;
}

export interface CheckMinMaxContext<Values = Record<string, unknown>> {
	issues: unknown[];
	value: Values;
}

/**
 * Pushes a validation issue when the given min/max fields are present and min exceeds max.
 *
 * @param ctx - The zod check context of the schema being validated
 * @param options - The field names to compare and the message to report
 */
export function checkMinMaxFields<Values extends Record<string, unknown>>(
	ctx: CheckMinMaxContext<Values>,
	options: CheckMinMaxFieldsOptions,
) {
	const min = ctx.value[options.minFieldName];
	const max = ctx.value[options.maxFieldName];

	if (typeof min !== 'number' || typeof max !== 'number' || min <= max) {
		return;
	}

	ctx.issues.push({
		code: 'too_big',
		message: options.message,
		inclusive: true,
		maximum: max,
		type: 'number',
		path: [options.minFieldName],
		origin: 'number',
		input: min,
	});
}

/**
 * Pushes a validation issue when the given min/max values are present and min exceeds max.
 *
 * @param ctx - The zod check context of a schema with optional min_values and max_values fields
 */
export function checkMinMaxValues<Values extends { max_values?: number; min_values?: number }>(
	ctx: CheckMinMaxContext<Values>,
) {
	checkMinMaxFields(ctx, {
		message: 'The maximum amount of values must be greater than or equal to the minimum amount of values',
		maxFieldName: 'max_values',
		minFieldName: 'min_values',
	});
}
