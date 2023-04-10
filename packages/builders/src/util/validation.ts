let validate = true;

/**
 * Enables validators.
 */
export function enableValidators() {
	return (validate = true);
}

/**
 * Disables validators.
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
