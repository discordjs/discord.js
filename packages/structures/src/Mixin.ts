import { DataTemplatePropertyName, OptimizeDataPropertyName, type Structure } from './Structure.js';
import type { kData } from './utils/symbols.js';
import { kMixinConstruct } from './utils/symbols.js';
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
	const dataTemplates: Record<string, unknown>[] = [];
	const dataOptimizations: ((data: unknown) => void)[] = [];
	const constructors: ((data: Partial<unknown>) => void)[] = [];

	for (const mixin of mixins) {
		// The entire prototype chain, in reverse order, since we want to copy it all
		const prototypeChain: MixinBase<DestinationClass['prototype']>[] = [];
		let extendedClass = mixin;
		while (extendedClass.prototype !== undefined) {
			if (
				DataTemplatePropertyName in extendedClass &&
				typeof extendedClass.DataTemplate === 'object' &&
				// eslint-disable-next-line no-eq-null, eqeqeq
				extendedClass.DataTemplate != null
			) {
				dataTemplates.push(extendedClass.DataTemplate as Record<string, unknown>);
			}

			prototypeChain.unshift(extendedClass.prototype);
			extendedClass = Object.getPrototypeOf(extendedClass);
		}

		for (const prototype of prototypeChain) {
			// Synboled data isn't traversed by Object.entries, we can handle it here
			if (prototype[kMixinConstruct]) {
				constructors.push(prototype[kMixinConstruct]);
			}

			// Copy instance methods and setters / getters
			const originalDescriptors = Object.getOwnPropertyDescriptors(prototype);
			const usingDescriptors: { [prop: string]: PropertyDescriptor } = {};
			for (const [prop, descriptor] of Object.entries(originalDescriptors)) {
				// Drop constructor
				if (['constructor'].includes(prop)) {
					continue;
				}

				// Special case for optimize function, we want to combine these
				if (prop === OptimizeDataPropertyName) {
					if (typeof descriptor.value !== 'function') return;
					dataOptimizations.push(descriptor.value);
					continue;
				}

				// Shouldn't be anything other than these without being instantiated, but just in case
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

	// Set the function to call any mixed constructors
	if (constructors.length > 0) {
		Object.defineProperty(destination.prototype, kMixinConstruct, {
			writable: true,
			enumerable: false,
			configurable: true,
			// eslint-disable-next-line func-name-matching
			value: function _mixinConstructors(data: Partial<unknown>) {
				for (const construct of constructors) {
					construct.call(this, data);
				}
			},
		});
	}

	// Combine all optimizations into a single function
	const baseOptimize = Object.getOwnPropertyDescriptor(destination, OptimizeDataPropertyName);
	if (baseOptimize && typeof baseOptimize.value === 'function') {
		// call base last (mimick constructor behavior)
		dataOptimizations.push(baseOptimize.value);
	}

	// Cache so it's not recalculated every time we construct / patch
	const superOptimize = Object.getOwnPropertyDescriptor(
		Object.getPrototypeOf(destination).prototype,
		OptimizeDataPropertyName,
	);
	if (superOptimize && typeof superOptimize.value === 'function') {
		// call super first (mimick constructor behavior)
		dataOptimizations.unshift(superOptimize.value);
	}

	// If there's more than one optimization or if there's an optimization that isn't on the destination (base)
	if (dataOptimizations.length > 1 || (dataOptimizations.length === 1 && !baseOptimize)) {
		Object.defineProperty(destination.prototype, OptimizeDataPropertyName, {
			writable: true,
			enumerable: false,
			configurable: true,
			// eslint-disable-next-line func-name-matching
			value: function _mixinOptimizeData(data: unknown) {
				for (const optimization of dataOptimizations) {
					optimization.call(this, data);
				}
			},
		});
	}

	// Copy the properties (setters) of each mixins template to the destinations template
	if (dataTemplates.length > 0) {
		destination[DataTemplatePropertyName] ??= {};
		for (const template of dataTemplates) {
			Object.defineProperties(destination[DataTemplatePropertyName], Object.getOwnPropertyDescriptors(template));
		}
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
				? Omit<MergePrototypes<Mixins>, keyof BaseClass | typeof kMixinConstruct>
				: never
			: never
		: never
>;
