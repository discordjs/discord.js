import type { Store } from './Store.js';

/**
 * An in-memory {@link Store}. Values are copied on the way in and out.
 */
export class MemoryStore implements Store {
	readonly #values = new Map<string, unknown>();

	readonly #counters = new Map<string, number>();

	readonly #logs = new Map<string, unknown[]>();

	public get<Value>(key: string): Value | undefined {
		const value = this.#values.get(key);
		return value === undefined ? undefined : structuredClone(value as Value);
	}

	public put<Value>(key: string, value: Value): void {
		this.#values.set(key, structuredClone(value));
	}

	public delete(key: string): boolean {
		return this.#values.delete(key);
	}

	public list<Value>(prefix: string): [key: string, value: Value][] {
		const entries: [string, Value][] = [];
		for (const [key, value] of this.#values) {
			if (key.startsWith(prefix)) entries.push([key, structuredClone(value as Value)]);
		}

		return entries;
	}

	public increment(counter: string, by = 1): number {
		const value = (this.#counters.get(counter) ?? 0) + by;
		this.#counters.set(counter, value);
		return value;
	}

	public append<Entry>(log: string, entry: Entry): number {
		let entries = this.#logs.get(log);
		if (!entries) {
			entries = [];
			this.#logs.set(log, entries);
		}

		return entries.push(structuredClone(entry)) - 1;
	}

	public read<Entry>(log: string, from = 0): Entry[] {
		return structuredClone((this.#logs.get(log) ?? []).slice(from) as Entry[]);
	}
}
