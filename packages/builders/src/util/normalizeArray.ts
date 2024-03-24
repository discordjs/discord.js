/**
 * Normalizes data that is a rest parameter or an array into an array with a depth of 1.
 *
 * @typeParam ItemType - The data that must satisfy {@link RestOrArray}.
 * @param arr - The (possibly variadic) data to normalize
 */
export function normalizeArray<ItemType>(arr: RestOrArray<ItemType>): ItemType[] {
	if (Array.isArray(arr[0])) return [...arr[0]];
	return arr as ItemType[];
}

/**
 * Represents data that may be an array or came from a rest parameter.
 *
 * @remarks
 * This type is used throughout builders to ensure both an array and variadic arguments
 * may be used. It is normalized with {@link normalizeArray}.
 */
export type RestOrArray<Type> = Type[] | [Type[]];
