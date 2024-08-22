/**
 * Represents an object capable of representing itself as a JSON object
 *
 * @typeParam Value - The JSON type corresponding to {@link JSONEncodable.toJSON} outputs.
 */
export interface JSONEncodable<Value> {
	/**
	 * Transforms this object to its JSON format
	 */
	toJSON(): Value;
}

/**
 * Indicates if an object is encodable or not.
 *
 * @param maybeEncodable - The object to check against
 */
export function isJSONEncodable(maybeEncodable: unknown): maybeEncodable is JSONEncodable<unknown> {
	return maybeEncodable !== null && typeof maybeEncodable === 'object' && 'toJSON' in maybeEncodable;
}
