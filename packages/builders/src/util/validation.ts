let validate = true;

/**
 * Enables validators.
 */
export const enableValidators = () => (validate = true);

/**
 * Disables validators.
 */
export const disableValidators = () => (validate = false);

/**
 * Checks whether validation is occurring.
 */
export const isValidationEnabled = () => validate;
