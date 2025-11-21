import { z } from 'zod';

/**
 * An error that is thrown when validation fails.
 */
export class ValidationError extends Error {
	/**
	 * The underlying cause of the validation error.
	 */
	public override readonly cause: z.ZodError;

	/**
	 * @internal
	 */
	public constructor(error: z.ZodError) {
		super(z.prettifyError(error));

		this.name = 'ValidationError';
		this.cause = error;
	}
}
