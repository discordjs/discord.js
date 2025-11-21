import { Locale } from 'discord-api-types/v10';
import { z } from 'zod';

export const idPredicate = z.int().min(0).max(2_147_483_647).optional();
export const customIdPredicate = z.string().min(1).max(100);

export const memberPermissionsPredicate = z.coerce.bigint();

export const localeMapPredicate = z.strictObject(
	Object.fromEntries(Object.values(Locale).map((loc) => [loc, z.string().optional()])) as Record<
		Locale,
		z.ZodOptional<z.ZodString>
	>,
);
