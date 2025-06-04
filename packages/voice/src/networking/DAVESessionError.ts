export enum DAVESessionErrorKind {
	/**
	 * This error was thrown while processing a commit.
	 */
	Commit,
	/**
	 * This error was thrown while processing a welcome.
	 */
	Welcome,
}

/**
 * An error emitted by a DAVESession. Contains information with
 * debugging and identifying where the error came from.
 */
export class DAVESessionError extends Error {
	/**
	 * The transition ID associated with the error.
	 */
	public readonly transitionId?: number;

	/**
	 * The kind of error context this was from.
	 */
	public readonly kind: DAVESessionErrorKind;

	public constructor(error: Error, kind: DAVESessionErrorKind, transitionId?: number) {
		super(error.message);
		this.kind = kind;
		if (transitionId) this.transitionId = transitionId;
		this.name = error.name;
		this.stack = error.stack!;
	}
}
