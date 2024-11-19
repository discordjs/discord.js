/**
 * Groups members of an iterable according to the return value of the passed callback.
 *
 * @param items - An iterable.
 * @param keySelector - A callback which will be invoked for each item in items.
 * @typeParam Key - The type of the key.
 * @typeParam Value - The type of the value.
 * @example
 * ```ts
 * const items = [
 * 	{ name: 'Alice', age: 20 },
 * 	{ name: 'Bob', age: 20 },
 * 	{ name: 'Charlie', age: 30 },
 * ];
 *
 * groupBy(items, item => item.age);
 * // Map { 20 => [ { name: 'Alice', age: 20 }, { name: 'Bob', age: 20 } ], 30 => [ { name: 'Charlie', age: 30 } ] }
 * ```
 */
export function groupBy<Key, Value>(
	items: Iterable<Value>,
	keySelector: (item: Value, index: number) => Key,
): Map<Key, Value[]> {
	if (typeof Map.groupBy === 'function') {
		return Map.groupBy(items, keySelector);
	}

	const map = new Map<Key, Value[]>();
	let index = 0;

	for (const item of items) {
		const key = keySelector(item, index++);
		const list = map.get(key);

		if (list) list.push(item);
		else map.set(key, [item]);
	}

	return map;
}
