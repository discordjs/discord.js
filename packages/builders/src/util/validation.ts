import type { ZodTypeAny, output } from 'zod';
import { fromZodError } from 'zod-validation-error';

let validate = true;

/**
 * Enables validators.
 *
 * @returns Whether validation is occurring.
 */
export function enableValidators() {
	return (validate = true);
}

/**
 * Disables validators.
 *
 * @returns Whether validation is occurring.
 */
export function disableValidators() {
	return (validate = false);
}

/**
 * Checks whether validation is occurring.
 */
export function isValidationEnabled() {
	return validate;
}

/**
 * Parses a value with a given validator
 *
 * @param validator - Tthe zod validator to use
 * @param value - The value to parse
 * @returns The result from parsing
 * @internal
 */
export function parse<Validator extends ZodTypeAny>(validator: Validator, value: unknown): output<Validator> {
	const result = validator.safeParse(value);
	if (isValidationEnabled() && !result.success) {
		throw fromZodError(result.error);
	}

	return result.success ? result.data : value;
}
