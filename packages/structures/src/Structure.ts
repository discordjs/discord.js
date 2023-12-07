import { data as kData } from './utils/symbols.js';
import type { ReplaceOmittedWithUnknown } from './utils/types.js';

/**
 * Explanation of the type complexity surround Structure:
 *
 * There are two layers of Omitted generics, one here, which allows omitting things at the library level so we do not accidentally
 * access them, in addition to whatever the user does at the layer above.
 *
 * The second layer, in the exported structure is effectively a type cast that allows the getters types to match whatever data template is ued
 *
 * In order to safely set and access this data, the constructor and patch take data as "partial" and forcibly assigns it to kData. To acommodate this,
 * kData stores properties as `unknown` when it is omitted, which allows accessing the property in getters even when it may not actually be present.
 * This is the most technically correct way of represnting the value, especially since there is no way to guarantee runtime matches the "type cast."
 *
 * @internal
 */

export abstract class Structure<DataType, Omitted extends keyof DataType | '' = ''> {
	protected [kData]: Readonly<ReplaceOmittedWithUnknown<Omitted, DataType>>;

	protected constructor(data: Readonly<Partial<DataType>>, { template }: { template?: {} } = {}) {
		this[kData] = Object.assign(template ? Object.create(template) : {}, data);
	}

	protected _patch(data: Readonly<Partial<DataType>>, { template }: { template?: {} } = {}): this {
		this[kData] = Object.assign(template ? Object.create(template) : {}, this[kData], data);
		return this;
	}

	public toJSON(): DataType {
		// This will be DataType provided nothing is omitted, when omits occur, subclass needs to overwrite this.
		return { ...this[kData] } as DataType;
	}
}
