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
