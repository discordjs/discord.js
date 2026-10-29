import type { Snowflake } from 'discord-api-types/v10';

/**
 * Anything that identifies a record
 */
export type IdResolvable = Snowflake | { readonly id: Snowflake };

export function resolveId(value: IdResolvable): Snowflake {
	return typeof value === 'string' ? value : value.id;
}

/**
 * Copies a value the way sending it over the wire would, dropping `undefined` and anything else JSON cannot carry
 */
export function wireCopy<Value>(value: Value): Value {
	return JSON.parse(JSON.stringify(value)) as Value;
}
