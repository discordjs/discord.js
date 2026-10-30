/**
 * The storage backend behind a world.
 *
 * @remarks
 * Values must be JSON-serializable.
 */
export interface Store {
	/**
	 * Appends an entry to an append-only log and returns its index.
	 */
	append<Entry>(log: string, entry: Entry): number;
	/**
	 * Deletes a key, returning whether it existed.
	 */
	delete(key: string): boolean;
	/**
	 * Gets the value stored at a key.
	 */
	get<Value>(key: string): Value | undefined;
	/**
	 * Atomically increments a counter and returns its new value. Counters start at 0.
	 */
	increment(counter: string, by?: number): number;
	/**
	 * Lists every key starting with the given prefix, in insertion order.
	 */
	list<Value>(prefix: string): [key: string, value: Value][];
	/**
	 * Stores a value at a key, replacing any previous value.
	 */
	put<Value>(key: string, value: Value): void;
	/**
	 * Reads an append-only log, starting at the given index.
	 */
	read<Entry>(log: string, from?: number): Entry[];
}
