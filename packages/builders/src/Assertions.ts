import { Locale } from 'discord-api-types/v10';
import { z } from 'zod/v4';

export const customIdPredicate = z.string().min(1).max(100);

export const memberPermissionsPredicate = z.coerce.bigint();

export const localeMapPredicate = z.strictObject(
	Object.fromEntries(Object.values(Locale).map((loc) => [loc, z.string().optional()])) as Record<
		Locale,
		z.ZodOptional<z.ZodString>
	>,
);

export const refineURLPredicate = (allowedProtocols: string[]) => (value: string) => {
	// eslint-disable-next-line n/prefer-global/url
	const url = new URL(value);
	return allowedProtocols.includes(url.protocol);
};
