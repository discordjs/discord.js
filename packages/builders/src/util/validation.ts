import type { z } from 'zod';
import { ValidationError } from './ValidationError.js';

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
 * @throws {@link ValidationError}
 * Throws if the value does not pass validation, if enabled.
 * @internal
 */
export function validate<Validator extends z.ZodType>(
	validator: Validator,
	value: unknown,
	validationOverride?: boolean,
): z.output<Validator> {
	if (validationOverride === false || (validationOverride === undefined && !isValidationEnabled())) {
		return value as z.output<Validator>;
	}

	const result = validator.safeParse(value);

	if (!result.success) {
		throw new ValidationError(result.error);
	}

	return result.data;
}
