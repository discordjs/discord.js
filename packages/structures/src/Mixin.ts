import type { Structure } from './Structure.js';
import type { kData } from './utils/symbols.js';
import type { CollapseUnion, MergePrototypes } from './utils/types.js';

export type Mixinable<ClassType> = new (...args: unknown[]) => ClassType;

export type MixinBase<BaseClass extends Structure<unknown>> =
	BaseClass extends Structure<infer DataType, infer Omitted> ? Structure<DataType, Omitted> : never;

/**
 * Copies the prototype (getters, setters, and methods) of all mixins to the destination class.
 * For type information see {@link MixinTypes}
 *
 * @param destination - The class to apply the mixins to, must extend the base that the mixins expect it to.
 * @param mixins - Classes that contain "pure" prototypes to be copied on top of the destination class prototype
 * @remarks All mixins should be "pure" in that they only contain getters, setters, and methods.
 * The runtime code will only copy these, and adding properties to the class only results
 * in the types of the mixed class being wrong.
 * @example
 * ```
 * // Interface merging on the mixin to give type access to props on the base and kData that are available once copied
 * interface TextMixin extends Channel {}
 * class TextMixin {
 * 	// Methods / getters
 * }
 *
 * // Interface merging on the mixed class to give it accurate type information within the declaration and when instantiated
 * interface TextChannel extends MixinTypes<Channel, [TextMixin]> {}
 * class TextChannel extends Channel {}
 *
 * // Apply for runtime
 * Mixin(TextChannel, [TextMixin])
 * ```
 * @typeParam DestinationClass - The class to be mixed, ensures that the mixins provided can be used with this destination
 */
export function Mixin<DestinationClass extends typeof Structure<unknown>>(
	destination: DestinationClass,
	mixins: Mixinable<MixinBase<DestinationClass['prototype']>>[],
) {
	for (const mixin of mixins) {
		const originalDescriptors = Object.getOwnPropertyDescriptors(
			mixin.prototype as MixinBase<DestinationClass['prototype']>,
		);
		const usingDescriptors: { [prop: string]: PropertyDescriptor } = {};
		for (const [prop, descriptor] of Object.entries(originalDescriptors)) {
			if (['constructor'].includes(prop)) {
				continue;
			}

			if (
				typeof descriptor.get !== 'undefined' ||
				typeof descriptor.set !== 'undefined' ||
				typeof descriptor.value === 'function'
			) {
				usingDescriptors[prop] = descriptor;
			}
		}

		Object.defineProperties(destination.prototype, usingDescriptors);
	}
}

/**
 * Type utility to provide accurate types for the runtime effects of {@link Mixin}
 *
 * @typeParam BaseClass - The class that is being directly extended, must match the class that the mixins are expecting
 * @typeParam Mixins - The mixins that will be applied to this class via a {@link Mixin} call
 */
export type MixinTypes<
	BaseClass extends Structure<unknown>,
	Mixins extends readonly MixinBase<BaseClass>[],
> = CollapseUnion<
	BaseClass extends Structure<infer DataType, infer Omitted>
		? Mixins[number] extends Structure<DataType, Omitted>
			? // prettier-ignore
				Structure<DataType, Omitted>[typeof kData] extends
				// @ts-expect-error kData is protected
				Mixins[number][typeof kData]
				? Omit<MergePrototypes<Mixins>, keyof BaseClass>
				: never
			: never
		: never
>;
