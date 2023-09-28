/**
 * Normalizes data that is a rest parameter or an array into an array with a depth of 1.
 *
 * @typeParam T - The data that must satisfy {@link RestOrArray}.
 * @param arr - The (possibly variadic) data to normalize
 */
export function normalizeArray<T>(arr: RestOrArray<T>): T[] {
	if (Array.isArray(arr[0])) return arr[0];
	return arr as T[];
}

/**
 * Represents data that may be an array or came from a rest parameter.
 *
 * @remarks
 * This type is used throughout builders to ensure both an array and variadic arguments
 * may be used. It is normalized with {@link normalizeArray}.
 */
export type RestOrArray<T> = T[] | [T[]];
