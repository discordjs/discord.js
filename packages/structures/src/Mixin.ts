import { DataTemplatePropertyName, OptimizeDataPropertyName, type Structure } from './Structure.js';
import { kMixinConstruct, kMixinToJSON } from './utils/symbols.js';

export type Mixinable<ClassType> = new (...args: unknown[]) => ClassType;

export type MixinBase<BaseClass extends Structure<{}>> =
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
export function Mixin<DestinationClass extends typeof Structure<{}>>(
	destination: DestinationClass,
	mixins: Mixinable<MixinBase<DestinationClass['prototype']>>[],
) {
	const dataTemplates: Record<string, unknown>[] = [];
	const dataOptimizations: ((data: unknown) => void)[] = [];
	const enrichToJSONs: ((data: Partial<unknown>) => void)[] = [];
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
			// Symboled data isn't traversed by Object.entries, we can handle it here
			if (prototype[kMixinConstruct]) {
				constructors.push(prototype[kMixinConstruct]);
			}

			if (prototype[kMixinToJSON]) {
				enrichToJSONs.push(prototype[kMixinToJSON]);
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
					if (typeof descriptor.value !== 'function')
						throw new RangeError(`Expected ${prop} to be a function, received ${typeof descriptor.value} instead.`);
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
		// call base last (mimic constructor behavior)
		dataOptimizations.push(baseOptimize.value);
	}

	const superOptimize = Object.getOwnPropertyDescriptor(
		Object.getPrototypeOf(destination).prototype,
		OptimizeDataPropertyName,
	);
	// the mixin base optimize should call super, so we can ignore the super in that case
	if (!baseOptimize && superOptimize && typeof superOptimize.value === 'function') {
		// call super first (mimic constructor behavior)
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

	if (enrichToJSONs.length > 0) {
		Object.defineProperty(destination.prototype, kMixinToJSON, {
			writable: true,
			enumerable: false,
			configurable: true,
			// eslint-disable-next-line func-name-matching
			value: function _mixinToJSON(data: Partial<unknown>) {
				for (const enricher of enrichToJSONs) {
					enricher.call(this, data);
				}
			},
		});
	}

	// Copy the properties (setters) of each mixins template to the destinations template
	if (dataTemplates.length > 0) {
		if (!Object.getOwnPropertyDescriptor(destination, DataTemplatePropertyName)) {
			Object.defineProperty(destination, DataTemplatePropertyName, {
				value: Object.defineProperties({}, Object.getOwnPropertyDescriptors(destination[DataTemplatePropertyName])),
				writable: true,
				enumerable: true,
				configurable: true,
			});
		}

		for (const template of dataTemplates) {
			Object.defineProperties(destination[DataTemplatePropertyName], Object.getOwnPropertyDescriptors(template));
		}
	}
}
