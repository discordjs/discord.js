let validate = true;

export const enableValidators = () => (validate = true);
export const disableValidators = () => (validate = false);
export const isValidationEnabled = () => validate;
