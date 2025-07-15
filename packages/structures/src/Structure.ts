import { kClone, kData, kMixinConstruct, kMixinToJSON, kPatch } from './utils/symbols.js';
import type { ReplaceOmittedWithUnknown } from './utils/types.js';

export const DataTemplatePropertyName = 'DataTemplate';
export const OptimizeDataPropertyName = 'optimizeData';

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
 * In order to safely set and access this data, the constructor and patch take data as "partial" and forcibly assigns it to kData. To accommodate this,
 * kData stores properties as `unknown` when it is omitted, which allows accessing the property in getters even when it may not actually be present.
 * This is the most technically correct way of representing the value, especially since there is no way to guarantee runtime matches the "type cast."
 */
export abstract class Structure<DataType extends {}, Omitted extends keyof DataType | '' = ''> {
	/**
	 * A construct function used when mixing to allow mixins to set optimized property defaults
	 *
	 * @internal
	 * @remarks This should only be used to set defaults, setting optimized values should be done
	 * in the mixins `optimizeData` method, which will be called automatically.
	 * @param data - The full API data received by the Structure
	 */
	protected [kMixinConstruct]?(data: Partial<DataType>): void;

	/**
	 * A function used when mixing to allow mixins to add properties to the result of toJSON
	 *
	 * @internal
	 * @remarks This should only be used to add properties that the mixin optimizes, if the raw
	 * JSON data is unchanged the property will already be returned.
	 * @param data - The result of the base class toJSON Structure before it gets returned
	 */
	protected [kMixinToJSON]?(data: Partial<DataType>): void;

	/**
	 * The template used for removing data from the raw data stored for each Structure.
	 *
	 * @remarks This template should be overridden in all subclasses to provide more accurate type information.
	 * The template in the base {@link Structure} class will have no effect on most subclasses for this reason.
	 */
	protected static readonly DataTemplate: Record<string, unknown> = {};

	/**
	 * @returns A cloned version of the data template, ready to create a new data object.
	 */
	private getDataTemplate() {
		return Object.create((this.constructor as typeof Structure).DataTemplate);
	}

	/**
	 * The raw data from the API for this structure
	 *
	 * @internal
	 */
	protected [kData]: Readonly<ReplaceOmittedWithUnknown<Omitted, DataType>>;

	/**
	 * Creates a new structure to represent API data
	 *
	 * @param data - the data from the API that this structure will represent
	 * @remarks To be made public in subclasses
	 * @internal
	 */
	public constructor(data: Readonly<Partial<DataType>>, ..._rest: unknown[]) {
		this[kData] = Object.assign(this.getDataTemplate(), data);
		this[kMixinConstruct]?.(data);
	}

	/**
	 * Patches the raw data of this object in place
	 *
	 * @param data - the updated data from the API to patch with
	 * @remarks To be made public in subclasses
	 * @returns this
	 * @internal
	 */
	protected [kPatch](data: Readonly<Partial<DataType>>): this {
		this[kData] = Object.assign(this.getDataTemplate(), this[kData], data);
		this.optimizeData(data);
		return this;
	}

	/**
	 * Creates a clone of this structure
	 *
	 * @returns a clone of this
	 * @internal
	 */
	protected [kClone](patchPayload?: Readonly<Partial<DataType>>): typeof this {
		const clone = this.toJSON();
		// @ts-expect-error constructor is of abstract class is unknown
		return new this.constructor(
			// Ensure the ts-expect-error only applies to the constructor call
			patchPayload ? Object.assign(clone, patchPayload) : clone,
		);
	}

	/**
	 * Function called to ensure stored raw data is in optimized formats, used in tandem with a data template
	 *
	 * @example created_timestamp is an ISO string, this can be stored in optimized form as a number
	 * @param _data - the raw data received from the API to optimize
	 * @remarks Implementation to be done in subclasses and mixins where needed.
	 * For typescript users, mixins must use the closest ancestors access modifier.
	 * @remarks Automatically called in Structure[kPatch] but must be called manually in the constructor
	 * of any class implementing this method.
	 * @remarks Additionally, when implementing, ensure to call `super._optimizeData` if any class in the super chain aside
	 * from Structure contains an implementation.
	 * Note: mixins do not need to call super ever as the process of mixing walks the prototype chain.
	 * @virtual
	 * @internal
	 */
	protected optimizeData(_data: Partial<DataType>) {}

	/**
	 * Transforms this object to its JSON format with raw API data (or close to it),
	 * automatically called by `JSON.stringify()` when this structure is stringified
	 *
	 * @remarks
	 * The type of this data is determined by omissions at runtime and is only guaranteed for default omissions
	 * @privateRemarks
	 * When omitting properties at the library level, this must be overridden to re-add those properties
	 */
	public toJSON(): DataType {
		// This will be DataType provided nothing is omitted, when omits occur, subclass needs to overwrite this.
		const data =
			// Spread is way faster than structuredClone, but is shallow. So use it only if there is no nested objects
			(
				Object.values(this[kData]).some((value) => typeof value === 'object' && value !== null)
					? structuredClone(this[kData])
					: { ...this[kData] }
			) as DataType;
		this[kMixinToJSON]?.(data);
		return data;
	}
}
