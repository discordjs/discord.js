/* eslint-disable jsdoc/check-param-names */
import { kData, kMixinConstruct } from './utils/symbols.js';
import type { ReplaceOmittedWithUnknown } from './utils/types.js';

/**
 * Additional options needed to appropriately construct / patch data
 *
 * @internal
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface StructureExtraOptions {}

export const DataTemplatePropertyName = 'DataTemplate';
export const OptimizeDataPropertyName = '_optimizeData';

/**
 * Represents a data model from the Discord API
 *
 * @privateRemarks
 * Explanation of the type complexity surround Structure:
 *
 * There are two layers of Omitted generics, one here, which allows omitting things at the library level so we do not accidentally
 * access them, in addition to whatever the user does at the layer above.
 *
 * The second layer, in the exported structure is effectively a type cast that allows the getters types to match whatever data template is used
 *
 * In order to safely set and access this data, the constructor and patch take data as "partial" and forcibly assigns it to kData. To acommodate this,
 * kData stores properties as `unknown` when it is omitted, which allows accessing the property in getters even when it may not actually be present.
 * This is the most technically correct way of representing the value, especially since there is no way to guarantee runtime matches the "type cast."
 */
export abstract class Structure<DataType, Omitted extends keyof DataType | '' = ''> {
	/**
	 * A construct function used when mixing to allow mixins to set optimized property defaults
	 *
	 * @remarks This should only be used to set defaults, setting optimized values should be done
	 * in the mixins `_optimizeData` method, which will be called automatically.
	 * @param data - The full API data received by the Structure
	 */
	protected [kMixinConstruct]?(data: Partial<DataType>): void;

	/**
	 * The template used for removing data from the raw data stored for each Structure.
	 *
	 * @remarks This template should be overriden in all subclasses to provide more accurate type information.
	 * The template in the base {@link Structure} class will have no effect on most subclasses for this reason.
	 */
	protected static DataTemplate: Record<string, unknown> = {};

	/**
	 * @returns A cloned version of the data template, ready to create a new data object.
	 */
	private _getDataTemplate() {
		return Object.create((this.constructor as typeof Structure).DataTemplate);
	}

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
	 * @remarks To be made public in subclasses
	 * @internal
	 */
	protected constructor(data: Readonly<Partial<DataType>>) {
		this[kData] = Object.assign(this._getDataTemplate(), data);
		this[kMixinConstruct]?.(data);
	}

	/**
	 * Patches the raw data of this object in place
	 *
	 * @param data - the updated data from the API to patch with
	 * @param extraOptions - any additional options needed to appropriately patch the data
	 * @remarks To be made public in subclasses
	 * @returns this
	 * @internal
	 */
	protected _patch(data: Readonly<Partial<DataType>>): this {
		this[kData] = Object.assign(this._getDataTemplate(), this[kData], data);
		this._optimizeData(data);
		return this;
	}

	/**
	 * Function called to ensure stored raw data is in optimized formats, used in tandem with a data template
	 *
	 * @example created_timestamp is an ISO string, this can be stored in optimized form as a number
	 * @param _data - the raw data received from the API to optimize
	 * @remarks Implementation to be done in subclasses and mixins where needed.
	 * For typescript users, mixins must use the closest ancestors access modifier.
	 * @remarks Automatically called in {@link Structure#_patch} but must be called manually in the constructor
	 * of any class implementing this method.
	 * @remarks Additionally, when implementing, ensure to call `super._optimzeData` if any class in the super chain aside from Structure
	 * contains an implementation. Note: mixins do not need to call super ever as the process of mixing walks the prototype chain.
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
