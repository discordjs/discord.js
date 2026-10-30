/**
 * An error in Discord's shape. Thrown by the world when an operation fails the way Discord would fail it, and
 * serialized as `{ code, message, errors }` wherever it reaches a client.
 */
export class DiscordError extends Error {
	public constructor(
		/**
		 * The JSON error code
		 *
		 * @see {@link https://discord.com/developers/docs/topics/opcodes-and-status-codes#json-json-error-codes}
		 */
		public readonly code: number,
		message: string,
		/**
		 * The HTTP status this error is served with
		 */
		public readonly status = 400,
		/**
		 * Field-level validation errors, if any
		 */
		public readonly errors?: unknown,
	) {
		super(message);
		this.name = 'DiscordError';
	}

	public toJSON() {
		return {
			code: this.code,
			message: this.message,
			errors: this.errors,
		};
	}
}
