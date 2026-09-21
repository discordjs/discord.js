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
export function checkMinMaxValues<
	Values extends { max_values?: number, min_values?: number; },
>(ctx: { issues: unknown[], value: Values; }) {
	if (
		ctx.value.min_values !== undefined &&
		ctx.value.max_values !== undefined &&
		ctx.value.min_values > ctx.value.max_values
	) {
		ctx.issues.push({
			code: 'too_big',
			message: `The maximum amount of values must be greater than or equal to the minimum amount of values`,
			inclusive: true,
			maximum: ctx.value.max_values,
			type: 'number',
			path: ['min_values'],
			origin: 'number',
			input: ctx.value.min_values,
		});
	}
}
