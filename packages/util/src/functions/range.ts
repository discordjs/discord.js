/**
 * Options for creating a range
 */
export interface RangeOptions {
	/**
	 * The end of the range (exclusive)
	 */
	end: number;
	/**
	 * The start of the range (inclusive)
	 */
	start: number;
	/**
	 * The amount to increment by
	 *
	 * @defaultValue `1`
	 */
	step?: number;
}

/**
 * A generator to yield numbers in a given range
 *
 * @remarks
 * This method is end-exclusive, for example the last number yielded by `range(5)` is 4. If you
 * prefer for the end to be included add 1 to the range or `end` option.
 * @param range - A number representing the the range to yield (exclusive) or an object with start, end and step
 * @example
 * Basic range
 * ```ts
 * for (const number of range(5)) {
 *  console.log(number);
 * }
 * // Prints 0, 1, 2, 3, 4
 * ```
 * @example
 * Range with a step
 * ```ts
 * for (const number in range({ start: 3, end: 10, step: 2 })) {
 * 	console.log(number);
 * }
 * // Prints 3, 5, 7, 9
 * ```
 */
export function* range(range: RangeOptions | number) {
	let rangeEnd: number;
	let start = 0;
	let step = 1;

	if (typeof range === 'number') {
		rangeEnd = range;
	} else {
		start = range.start;
		rangeEnd = range.end;
		step = range.step ?? 1;
	}

	for (let index = start; index < rangeEnd; index += step) {
		yield index;
	}
}
