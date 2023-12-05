import { data as kData } from './utils/symbols.js';

/**
 * Explanation of the type complexity surround Structure:
 *
 * There are two layers of Omitted generics, one here, which allows omitting things at the library level so we do not accidentally
 * access them. This generic should only be used within this library, as passing it higher will make it impossible to safely access kData
 *
 * The second layer, in the exported structure is effectively a type cast that allows the getters types to match whatever data template
 * is used. In order for this to function properly, we need to cast the return values of the getters,
 * utilizing this level of Omit to guarantee the original type or never.
 *
 * @internal
 */

export abstract class Structure<DataType, Omitted extends keyof DataType | '' = ''> {
	protected [kData]: Readonly<Omit<DataType, Omitted>>;

	protected constructor(data: Readonly<Omit<DataType, Omitted>>, { template }: { template?: {} } = {}) {
		this[kData] = Object.assign(template ? Object.create(template) : {}, data);
	}

	protected patch(data: Readonly<Partial<Omit<DataType, Omitted>>>, { template }: { template?: {} } = {}): this {
		this[kData] = Object.assign(template ? Object.create(template) : {}, this[kData], data);
		return this;
	}

	public toJSON(): DataType {
		// This will be DataType provided nothing is omitted, when omits occur, subclass needs to overwrite this.
		return { ...this[kData] } as DataType;
	}
}
