export type Serialized<T> = T extends bigint | symbol | (() => any)
	? never
	: T extends boolean | number | string | undefined
	? T
	: T extends { toJSON(): infer R }
	? R
	: T extends readonly (infer V)[]
	? Serialized<V>[]
	: T extends ReadonlyMap<unknown, unknown> | ReadonlySet<unknown>
	? // eslint-disable-next-line @typescript-eslint/ban-types
	  {}
	: { [K in keyof T]: Serialized<T[K]> };
