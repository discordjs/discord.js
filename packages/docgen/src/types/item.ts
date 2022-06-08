import type { DeclarationReflection } from 'typedoc';
import type { Config, Item } from '../interfaces/index.js';

export class DocumentedItem<T = Item | DeclarationReflection> {
	public constructor(public readonly data: T, public readonly config: Config) {}

	public serialize(): unknown {
		try {
			return this.serializer();
		} catch (err) {
			const error = err as Error;
			error.message = `Error while serializing ${this.detailedName()}: ${error.message}`;
			throw error;
		}
	}

	protected serializer() {
		throw new Error("Method 'serializer()' must be implemented.");
	}

	private detailedName() {
		const data = this.data as unknown as Item | undefined;
		if (!data) return this.constructor.name;
		if (data.id) return `${data.id} (${this.constructor.name})`;
		if (data.name) return `${data.name} (${this.constructor.name})`;
		return this.constructor.name;
	}
}
