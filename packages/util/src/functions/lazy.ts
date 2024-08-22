/**
 * Lazy is a wrapper around a value that is computed lazily. It is useful for
 * cases where the value is expensive to compute and the computation may not
 * be needed at all.
 *
 * @param cb - The callback to lazily evaluate
 * @typeParam Value - The type of the value
 * @example
 * ```ts
 * const value = lazy(() => computeExpensiveValue());
 * ```
 */
// eslint-disable-next-line promise/prefer-await-to-callbacks
export function lazy<Value>(cb: () => Value): () => Value {
	let defaultValue: Value;
	// eslint-disable-next-line promise/prefer-await-to-callbacks
	return () => (defaultValue ??= cb());
}
