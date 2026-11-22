import type { JSONEncodable } from '@discordjs/util';

/**
 * @privateRemarks
 * This is a type-guard util, because if you were to in-line `builder instanceof Constructor` in the `resolveBuilder`
 * function, TS doesn't narrow out the type `Builder`, causing a type error on the last return statement.
 * @internal
 */
function isBuilder<Builder extends JSONEncodable<any>>(
	builder: unknown,
	Constructor: new () => Builder,
): builder is Builder {
	return builder instanceof Constructor;
}

/**
 * "Resolves" a builder from the 3 ways it can be input:
 * 1. A clean instance
 * 2. A data object that can be used to construct the builder
 * 3. A function that takes a builder and returns a builder e.g. `builder => builder.setFoo('bar')`
 *
 * @typeParam Builder - The builder type
 * @typeParam BuilderData - The data object that can be used to construct the builder
 * @param builder - The user input, as described in the function description
 * @param Constructor - The constructor of the builder
 */
export function resolveBuilder<Builder extends JSONEncodable<any>, BuilderData extends Record<PropertyKey, any>>(
	builder: Builder | BuilderData | ((builder: Builder) => Builder),
	Constructor: new (data?: BuilderData) => Builder,
): Builder {
	if (isBuilder(builder, Constructor)) {
		return builder;
	}

	if (typeof builder === 'function') {
		return builder(new Constructor());
	}

	return new Constructor(builder);
}
