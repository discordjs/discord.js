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

/**
 * Pushes a validation issue when the given min/max values are present and min exceeds max.
 *
 * @param ctx - The zod check context of a schema with optional min_values and max_values fields
 * @param ctx.issues - The issues array to push the validation issue to
 * @param ctx.value - The value being validated
 */
export function checkMinMaxValues<Values extends { max_values?: number; min_values?: number }>(ctx: {
	issues: unknown[];
	value: Values;
}) {
	checkMinMaxFields(ctx, {
		message: `The maximum amount of values must be greater than or equal to the minimum amount of values`,
		maxFieldName: 'max_values',
		minFieldName: 'min_values',
	});
}

interface CheckMinMaxFieldsOptions {
	maxFieldName: string;
	message: string;
	minFieldName: string;
}

/**
 * Pushes a validation issue when the given min/max fields are present and min exceeds max.
 *
 * @param ctx - The zod check context of the schema being validated
 * @param ctx.issues - The issues array to push the validation issue to
 * @param ctx.value - The value being validated
 * @param options - The field names to compare and the message to report
 * @param options.message - The message of the validation issue
 * @param options.maxFieldName - The name of the maximum field
 * @param options.minFieldName - The name of the minimum field
 */
export function checkMinMaxFields<Values extends Record<string, unknown>>(
	ctx: { issues: unknown[]; value: Values },
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
