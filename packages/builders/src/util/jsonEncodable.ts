export interface JSONEncodable<T> {
	/**
	 * Transforms this object to its JSON format
	 */
	toJSON: () => T;
}

/**
 * Indicates if an object is encodable or not.
 * @param maybeEncodable - The object to check against
 */
export function isJSONEncodable(maybeEncodable: unknown): maybeEncodable is JSONEncodable<unknown> {
	return maybeEncodable !== null && typeof maybeEncodable === 'object' && 'toJSON' in maybeEncodable;
}
