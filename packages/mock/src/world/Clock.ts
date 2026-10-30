/**
 * The world's notion of the current time. Snowflakes and timestamps are generated from it, so moving it moves
 * account and message age.
 */
export class Clock {
	#offset = 0;

	public now(): number {
		return Date.now() + this.#offset;
	}

	/**
	 * Moves the world's by `ms` (+forward or -backward)
	 */
	public offset(ms: number): void {
		this.#offset += ms;
	}

	/**
	 * Sets the world's current time
	 */
	public set(time: Date | number): void {
		this.#offset = Number(time) - Date.now();
	}

	/**
	 * Resets the offset
	 */
	public reset(): void {
		this.#offset = 0;
	}
}
