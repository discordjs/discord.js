/**
 * Represents a structure that can be checked against another
 * given structure for equality
 *
 * @typeParam T - The type of object to compare the current object to
 */
export interface Equatable<T> {
	/**
	 * Whether or not this is equal to another structure
	 */
	equals: (other: T) => boolean;
}

/**
 * Indicates if an object is equatable or not.
 * @param maybeEquatable - The object to check against
 */
export function isEquatable(maybeEquatable: unknown): maybeEquatable is Equatable<unknown> {
	return maybeEquatable !== null && typeof maybeEquatable === 'object' && 'equals' in maybeEquatable;
}
