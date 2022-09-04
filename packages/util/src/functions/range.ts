/**
 * Yields the numbers in the given range as an array
 *
 * @param start - The start of the range
 * @param end - The end of the range (inclusive)
 * @example
 * ```ts
 * range(3, 5); // [3, 4, 5]
 * ```
 */
export function range(start: number, end: number): number[] {
	return Array.from({ length: end - start + 1 }, (_, index) => index + start);
}
