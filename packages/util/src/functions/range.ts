/**
 * Yields the numbers in the given range as an array
 *
 * @param start - The start of the range
 * @param end - The end of the range (inclusive)
 * @param step - The amount to increment between each number
 * @example
 * Basic range
 * ```ts
 * range(3, 5); // [3, 4, 5]
 * ```
 * @example
 * Range with a step
 * ```ts
 * range(3, 10, 2); // [3, 5, 7, 9]
 * ```
 */
export function range(start: number, end: number, step = 1): number[] {
	return Array.from({ length: (end - start) / step + 1 }, (_, index) => start + index * step);
}
