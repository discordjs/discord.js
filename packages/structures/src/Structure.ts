/* eslint-disable jsdoc/check-param-names */
import { kData } from './utils/symbols.js';
import type { ReplaceOmittedWithUnknown } from './utils/types.js';

/**
 * Additional options needed to appropriately construct / patch data
 *
 * @internal
 */
export interface StructureExtraOptions {
	/**
	 * The template used to remove unwanted properties from raw data storage
	 */
	template?: {};
}

/**
 * Represents a data model from the Discord API
 *
 * @privateRemarks
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
 */
export abstract class Structure<DataType, Omitted extends keyof DataType | '' = ''> {
	/**
	 * The raw data from the API for this struture
	 *
	 * @internal
	 */
	protected [kData]: Readonly<ReplaceOmittedWithUnknown<Omitted, DataType>>;

	/**
	 * Creates a new structure to represent API data
	 *
	 * @param data - the data from the API that this structure will represent
	 * @param extraOptions - any additional options needed to appropriately construct a structure from the data
	 * @internal
	 */
	protected constructor(data: Readonly<Partial<DataType>>, { template }: StructureExtraOptions = {}) {
		this[kData] = Object.assign(template ? Object.create(template) : {}, data);
		this._optimizeData(data);
	}

	/**
	 * Patches the raw data of this object in place
	 *
	 * @param data - the updated data from the API to patch with
	 * @param extraOptions - any additional options needed to appropriately patch the data
	 * @returns this
	 * @internal
	 */
	protected _patch(data: Readonly<Partial<DataType>>, { template }: StructureExtraOptions = {}): this {
		this[kData] = Object.assign(template ? Object.create(template) : {}, this[kData], data);
		this._optimizeData(data);
		return this;
	}

	/**
	 * Function called to ensure stored raw data is in optimized formats, used in tandem with a data template
	 *
	 * @example created_timestamp is an ISO string, this can be stored in optimized form as a number
	 * @param _data - the raw data received from the API to optimize
	 * @remarks Implementation to be done in subclasses where needed
	 * @virtual
	 * @internal
	 */
	protected _optimizeData(_data: Partial<DataType>) {}

	/**
	 * Transforms this object to its JSON format with raw API data (or close to it),
	 * automatically called by `JSON.stringify()` when this structure is stringified
	 *
	 * @remarks
	 * The type of this data is determined by omissions at runtime and is only guaranteed for default omissions
	 * @privateRemarks
	 * When omitting properties at the library level, this must be overriden to re-add those properties
	 */
	public toJSON(): DataType {
		// This will be DataType provided nothing is omitted, when omits occur, subclass needs to overwrite this.
		return { ...this[kData] } as DataType;
	}
}
