import { z } from 'zod';

let validationEnabled = true;

/**
 * Enables validators.
 *
 * @returns Whether validation is occurring.
 */
export function enableValidators() {
	return (validationEnabled = true);
}

/**
 * Disables validators.
 *
 * @returns Whether validation is occurring.
 */
export function disableValidators() {
	return (validationEnabled = false);
}

/**
 * Checks whether validation is occurring.
 */
export function isValidationEnabled() {
	return validationEnabled;
}

/**
 * Parses a value with a given validator, accounting for whether validation is enabled.
 *
 * @param validator - The zod validator to use
 * @param value - The value to parse
 * @param validationOverride - Force validation to run/not run regardless of your global preference
 * @returns The result from parsing
 * @internal
 */
export function validate<Validator extends z.ZodTypeAny>(
	validator: Validator,
	value: unknown,
	validationOverride?: boolean,
): z.output<Validator> {
	if (validationOverride === false || !isValidationEnabled()) {
		return value;
	}

	const result = validator.safeParse(value);

	if (!result.success) {
		// eslint-disable-next-line @typescript-eslint/only-throw-error
		throw z.prettifyError(result.error);
	}

	return result.data;
}
