/* eslint-disable unicorn/no-array-method-this-argument */
/* eslint-disable id-length */
import { describe, test, expect } from 'vitest';
import { Collection } from '../src/index.js';

type TestCollection<Value> = Collection<string, Value>;

function createCollection<Value = number>(): TestCollection<Value> {
	return new Collection();
}

function createCollectionFrom<Value = number>(...entries: [key: string, value: Value][]): TestCollection<Value> {
	return new Collection(entries);
}

function createTestCollection(): TestCollection<number> {
	return createCollectionFrom(['a', 1], ['b', 2], ['c', 3]);
}

function expectInvalidFunctionError(cb: () => unknown, val?: unknown): void {
	expect(() => {
		// eslint-disable-next-line promise/prefer-await-to-callbacks
		cb();
	}).toThrowError(new TypeError(`${val} is not a function`));
}

test('do basic map operations', () => {
	const coll = createCollectionFrom(['a', 1]);
	expect(coll.size).toEqual(1);
	expect(coll.has('a')).toBeTruthy();
	expect(coll.get('a')).toStrictEqual(1);
	coll.delete('a');
	expect(coll.has('a')).toBeFalsy();
	expect(coll.get('a')).toBeUndefined();
	coll.clear();
	expect(coll.size).toStrictEqual(0);
});

test('shallow clone the collection', () => {
	const coll = createTestCollection();
	const clone = coll.clone();
	expect([...coll.values()]).toStrictEqual([...clone.values()]);
});

test('merge multiple collections', () => {
	const coll1 = createCollectionFrom(['a', 1]);
	const coll2 = createCollectionFrom(['b', 2]);
	const coll3 = createCollectionFrom(['c', 3]);
	const merged = coll1.concat(coll2, coll3);
	expect([...merged.values()]).toStrictEqual([1, 2, 3]);
	expect(coll1 !== merged).toBeTruthy();
});

test('check equality of two collections', () => {
	const coll1 = createCollectionFrom(['a', 1]);
	const coll2 = createCollectionFrom(['a', 1]);
	expect(coll1.equals(coll2)).toBeTruthy();
	coll2.set('b', 2);
	expect(coll1.equals(coll2)).toBeFalsy();
	coll2.clear();
	expect(coll1.equals(coll2)).toBeFalsy();
});

// Specific method tests

describe('at() tests', () => {
	const coll = createTestCollection();

	test('positive index', () => {
		expect(coll.at(0)).toStrictEqual(1);
	});

	test('positive non-integer index', () => {
		expect(coll.at(1.5)).toStrictEqual(2);
	});

	test('negative index', () => {
		expect(coll.at(-1)).toStrictEqual(3);
	});

	test('negative non-integer index', () => {
		expect(coll.at(-2.5)).toStrictEqual(2);
	});

	test('invalid positive index', () => {
		expect(coll.at(3)).toBeUndefined();
	});

	test('invalid negative index', () => {
		expect(coll.at(-4)).toBeUndefined();
	});
});

describe('combineEntries() tests', () => {
	test('it adds entries together', () => {
		const c = Collection.combineEntries(
			[
				['a', 1],
				['b', 2],
				['a', 2],
			],
			(x, y) => x + y,
		);
		expect([...c]).toStrictEqual([
			['a', 3],
			['b', 2],
		]);
	});

	test('it really goes through all the entries', () => {
		const c = Collection.combineEntries(
			[
				['a', [1]],
				['b', [2]],
				['a', [2]],
			],
			(x, y) => x.concat(y),
		);
		expect([...c]).toStrictEqual([
			['a', [1, 2]],
			['b', [2]],
		]);
	});
});

describe('difference() tests', () => {
	const coll1 = createCollectionFrom(['a', 1], ['b', 2], ['c', 3]);
	const coll2 = createCollectionFrom(['b', 2], ['d', 4], ['e', 5]);

	test('it returns the difference the collections', () => {
		expect(coll1.difference(coll2)).toStrictEqual(createCollectionFrom(['a', 1], ['c', 3]));
	});

	test('it returns the difference the collections from the opposite order', () => {
		expect(coll2.difference(coll1)).toStrictEqual(createCollectionFrom(['d', 4], ['e', 5]));
	});
});

describe('each() tests', () => {
	const coll = createTestCollection();

	test('throws if fn is not a function', () => {
		// @ts-expect-error: Invalid function
		expectInvalidFunctionError(() => coll.each());
		// @ts-expect-error: Invalid function
		expectInvalidFunctionError(() => coll.each(123), 123);
	});

	test('binds the thisArg', () => {
		coll.each(function each() {
			expect(this).toBeNull();
		}, null);
	});

	test('iterate over each item', () => {
		const coll = createTestCollection();
		const a: [string, number][] = [];
		coll.each((v, k) => a.push([k, v]));
		expect(a).toStrictEqual([
			['a', 1],
			['b', 2],
			['c', 3],
		]);
	});
});

describe('ensure() tests', () => {
	test('throws if defaultValueGenerator is not a function', () => {
		const coll = createTestCollection();
		// @ts-expect-error: Invalid function
		expectInvalidFunctionError(() => coll.ensure('d', 'abc'), 'abc');
	});

	test('set new value if key does not exist', () => {
		const coll = createTestCollection();
		coll.ensure('d', () => 4);
		expect(coll.size).toStrictEqual(4);
		expect(coll.get('d')).toStrictEqual(4);
	});

	test('return existing value if key exists', () => {
		const coll = createTestCollection();
		expect(coll.ensure('b', () => 3)).toStrictEqual(2);
		expect(coll.get('b')).toStrictEqual(2);
		expect(coll.size).toStrictEqual(3);
	});
});

describe('equals() tests', () => {
	const coll1 = createCollectionFrom(['a', 1], ['b', 2]);
	const coll2 = createTestCollection();

	test('returns false if no collection is passed', () => {
		// @ts-expect-error: Invalid function
		expect(coll1.equals()).toBeFalsy();
	});

	test('the same collection should be equal to itself', () => {
		expect(coll1.equals(coll1)).toBeTruthy();
	});

	test('collections with different sizes should not be equal', () => {
		expect(coll1.equals(coll2)).toBeFalsy();
	});

	test('collections with the same size but differing items should not be equal', () => {
		const coll3 = createCollectionFrom(['a', 2], ['b', 3], ['c', 3]);
		expect(coll2.equals(coll3)).toBeFalsy();
	});
});

describe('every() tests', () => {
	const coll = createTestCollection();

	test('throws if fn is not a function', () => {
		// @ts-expect-error: Invalid function
		expectInvalidFunctionError(() => coll.every());
		// @ts-expect-error: Invalid function
		expectInvalidFunctionError(() => coll.every(123), 123);
	});

	test('binds the thisArg', () => {
		coll.every(function every() {
			expect(this).toBeNull();
			return true;
		}, null);
	});

	test('returns true if every item passes the predicate', () => {
		expect(coll.every((v) => v < 4)).toBeTruthy();
	});

	test("returns false if at least one item doesn't pass the predicate", () => {
		expect(coll.every((x) => x === 2)).toBeFalsy();
	});
});

describe('filter() tests', () => {
	const coll = createTestCollection();

	test('throws if fn is not a function', () => {
		// @ts-expect-error: Invalid function
		expectInvalidFunctionError(() => coll.filter());
		// @ts-expect-error: Invalid function
		expectInvalidFunctionError(() => coll.filter(123), 123);
	});

	test('binds the thisArg', () => {
		coll.filter(function filter() {
			expect(this).toBeNull();
			return true;
		}, null);
	});

	test('filter items from the collection', () => {
		const coll = createTestCollection();

		const filtered = coll.filter((x) => x % 2 === 1);
		expect(coll.size).toStrictEqual(3);
		expect(filtered.size).toStrictEqual(2);
		expect([...filtered.values()]).toStrictEqual([1, 3]);
	});
});

describe('find() tests', () => {
	const coll = createTestCollection();

	test('throws if fn is not a function', () => {
		// @ts-expect-error: Invalid function
		expectInvalidFunctionError(() => createCollection().find());
		// @ts-expect-error: Invalid function
		expectInvalidFunctionError(() => createCollection().find(123), 123);
	});

	test('binds the thisArg', () => {
		coll.find(function find() {
			expect(this).toBeNull();
			return true;
		}, null);
	});

	test('find an item in the collection', () => {
		const coll = createTestCollection();
		expect(coll.find((x) => x === 1)).toStrictEqual(1);
		expect(coll.find((x) => x === 10)).toBeUndefined();
	});
});

describe('findKey() tests', () => {
	const coll = createTestCollection();

	test('throws if fn is not a function', () => {
		// @ts-expect-error: Invalid function
		expectInvalidFunctionError(() => coll.findKey());
		// @ts-expect-error: Invalid function
		expectInvalidFunctionError(() => coll.findKey(123), 123);
	});

	test('binds the thisArg', () => {
		coll.findKey(function findKey() {
			expect(this).toBeNull();
			return true;
		}, null);
	});

	test('should find a key', () => {
		expect(coll.findKey((v) => v === 2)).toEqual('b');
	});

	test('returns undefined if no key matches', () => {
		expect(coll.findKey(() => false)).toBeUndefined();
	});
});

describe('first() tests', () => {
	const coll = createTestCollection();

	test('returns undefined if the collection is empty', () => {
		expect(createCollection().first()).toBeUndefined();
	});

	test('returns the first value', () => {
		expect(coll.first()).toStrictEqual(1);
	});

	test('returns empty array if amount is 0', () => {
		expect(coll.first(0)).toStrictEqual([]);
	});

	test('returns the values from the end if amount is negative', () => {
		expect(coll.first(-2)).toStrictEqual([2, 3]);
	});

	test('returns the first value of the collection', () => {
		expect(coll.first()).toStrictEqual(1);
	});

	test('returns all values of the collection when the amount is equal to the size', () => {
		expect(coll.first(3)).toStrictEqual([1, 2, 3]);
	});

	test('returns all values of the collection when the amount is bigger than the size', () => {
		expect(coll.first(4)).toStrictEqual([1, 2, 3]);
	});
});

describe('firstKey() tests', () => {
	const coll = createTestCollection();

	test('returns undefined if the collection is empty', () => {
		expect(createCollection().firstKey()).toBeUndefined();
	});

	test('returns the first key', () => {
		expect(coll.firstKey()).toStrictEqual('a');
	});

	test('returns empty array if amount is 0', () => {
		expect(coll.firstKey(0)).toStrictEqual([]);
	});

	test('returns the keys from the end if amount is negative', () => {
		expect(coll.firstKey(-2)).toStrictEqual(['b', 'c']);
	});

	test('returns the keys from the beginning if amount is positive', () => {
		expect(coll.firstKey(2)).toEqual(['a', 'b']);
	});

	test('returns all keys of the collection when the amount is equal to the size', () => {
		expect(coll.firstKey(3)).toStrictEqual(['a', 'b', 'c']);
	});

	test('returns all keys of the collection when the amount is bigger than the size', () => {
		expect(coll.firstKey(3)).toStrictEqual(['a', 'b', 'c']);
	});
});

describe('flatMap', () => {
	test('flats items from collection into a single collection', () => {
		const coll = new Collection<string, { a: Collection<string, number> }>();
		const coll1 = createCollectionFrom(['z', 1], ['x', 2]);
		const coll2 = createCollectionFrom(['c', 3], ['v', 4]);
		coll.set('a', { a: coll1 });
		coll.set('b', { a: coll2 });
		const mapped = coll.flatMap((x) => x.a);
		expect([...mapped.values()]).toStrictEqual([1, 2, 3, 4]);
	});
});

describe('hasAll() tests', () => {
	const coll = createTestCollection();

	test('all keys exist in the collection', () => {
		expect(coll.hasAll('a', 'b', 'c')).toBeTruthy();
	});

	test('some keys exist in the collection', () => {
		expect(coll.hasAll('b', 'c', 'd')).toBeFalsy();
	});

	test('no keys exist in the collection', () => {
		expect(coll.hasAll('d', 'e')).toBeFalsy();
	});
});

describe('hasAny() tests', () => {
	const coll = createTestCollection();

	test('all keys exist in the collection', () => {
		expect(coll.hasAny('a', 'b')).toBeTruthy();
	});

	test('some keys exist in the collection', () => {
		expect(coll.hasAny('c', 'd')).toBeTruthy();
	});

	test('no keys exist in the collection', () => {
		expect(coll.hasAny('d', 'e')).toBeFalsy();
	});
});

describe('intersection() tests', () => {
	const coll1 = createCollectionFrom(['a', 1], ['b', 2]);
	const coll2 = createCollectionFrom(['a', 1], ['c', 3]);

	test('it returns the intersection of the collections', () => {
		const c = coll1.intersection(coll2);
		expect(c).toBeInstanceOf(Collection);
		expect(c.size).toStrictEqual(1);

		expect(c).toStrictEqual(createCollectionFrom(['a', 1]));
	});
});

describe('keyAt() tests', () => {
	const coll = createTestCollection();

	test('positive index', () => {
		expect(coll.keyAt(0)).toStrictEqual('a');
	});

	test('positive non-integer index', () => {
		expect(coll.keyAt(1.5)).toStrictEqual('b');
	});

	test('negative index', () => {
		expect(coll.keyAt(-1)).toStrictEqual('c');
	});

	test('negative non-integer index', () => {
		expect(coll.keyAt(-2.5)).toStrictEqual('b');
	});

	test('invalid positive index', () => {
		expect(coll.keyAt(3)).toBeUndefined();
	});

	test('invalid negative index', () => {
		expect(coll.keyAt(-4)).toBeUndefined();
	});
});

describe('last() tests', () => {
	const coll = createTestCollection();

	test('returns undefined if the collection is empty', () => {
		expect(createCollection().last()).toBeUndefined();
	});

	test('returns the last value', () => {
		expect(coll.last()).toStrictEqual(3);
	});

	test('returns empty array if amount is 0', () => {
		expect(coll.last(0)).toStrictEqual([]);
	});

	test('returns the values from the beginning if amount is negative', () => {
		expect(coll.last(-2)).toStrictEqual([1, 2]);
	});

	test('returns the last value of the collection', () => {
		expect(coll.last()).toStrictEqual(3);
	});

	test('returns all values of the collection when the amount is equal to the size', () => {
		expect(coll.last(3)).toStrictEqual([1, 2, 3]);
	});

	test('returns all values of the collection when the amount is bigger than the size', () => {
		expect(coll.last(4)).toStrictEqual([1, 2, 3]);
	});
});

describe('lastKey() tests', () => {
	const coll = createTestCollection();

	test('returns undefined if the collection is empty', () => {
		expect(createCollection().lastKey()).toBeUndefined();
	});

	test('returns the last key', () => {
		expect(coll.lastKey()).toStrictEqual('c');
	});

	test('returns empty array if amount is 0', () => {
		expect(coll.lastKey(0)).toStrictEqual([]);
	});

	test('returns the keys from the beginning if amount is negative', () => {
		expect(coll.lastKey(-2)).toStrictEqual(['a', 'b']);
	});

	test('returns the last n keys if the amount option is used', () => {
		expect(coll.lastKey(2)).toStrictEqual(['b', 'c']);
	});

	test('returns all keys of the collection when the amount is equal to the size', () => {
		expect(coll.lastKey(3)).toStrictEqual(['a', 'b', 'c']);
	});

	test('returns all keys of the collection when the amount is bigger than the size', () => {
		expect(coll.lastKey(4)).toStrictEqual(['a', 'b', 'c']);
	});
});

describe('map() tests', () => {
	const coll = createTestCollection();

	test('throws if fn is not a function', () => {
		// @ts-expect-error: Invalid function
		expectInvalidFunctionError(() => coll.map());
		// @ts-expect-error: Invalid function
		expectInvalidFunctionError(() => coll.map(123), 123);
	});

	test('binds the thisArg', () => {
		coll.map(function map() {
			expect(this).toBeNull();
			return true;
		}, null);
	});

	test('map items in a collection into an array', () => {
		const mapped = coll.map((x) => x + 1);
		expect(mapped).toStrictEqual([2, 3, 4]);
	});
});

describe('mapValues() tests', () => {
	const coll = createTestCollection();

	test('throws if fn is not a function', () => {
		// @ts-expect-error: Invalid function
		expectInvalidFunctionError(() => coll.mapValues());
		// @ts-expect-error: Invalid function
		expectInvalidFunctionError(() => coll.mapValues(123), 123);
	});

	test('binds the thisArg', () => {
		coll.mapValues(function mapValues() {
			expect(this).toBeNull();
			return true;
		}, null);
	});

	test('map items in a collection into a collection', () => {
		const mapped = coll.mapValues((x) => x + 1);
		expect([...mapped.values()]).toStrictEqual([2, 3, 4]);
	});
});

describe('merge() tests', () => {
	const cL = createCollectionFrom(['L', 1], ['LR', 2]);
	const cR = createCollectionFrom(['R', 3], ['LR', 4]);

	test('merges two collection, with all keys together', () => {
		const c = cL.merge(
			cR,
			(x) => ({ keep: true, value: `L${x}` }),
			(y) => ({ keep: true, value: `R${y}` }),
			(x, y) => ({ keep: true, value: `LR${x},${y}` }),
		);
		expect(c.get('L')).toStrictEqual('L1');
		expect(c.get('R')).toStrictEqual('R3');
		expect(c.get('LR')).toStrictEqual('LR2,4');
		expect(c.size).toStrictEqual(3);
	});

	test('merges two collection, removing left entries', () => {
		const c = cL.merge(
			cR,
			() => ({ keep: false }),
			(y) => ({ keep: true, value: `R${y}` }),
			(x, y) => ({ keep: true, value: `LR${x},${y}` }),
		);
		expect(c.get('R')).toStrictEqual('R3');
		expect(c.get('LR')).toStrictEqual('LR2,4');
		expect(c.size).toStrictEqual(2);
	});

	test('merges two collection, removing right entries', () => {
		const c = cL.merge(
			cR,
			(x) => ({ keep: true, value: `L${x}` }),
			() => ({ keep: false }),
			(x, y) => ({ keep: true, value: `LR${x},${y}` }),
		);
		expect(c.get('L')).toStrictEqual('L1');
		expect(c.get('LR')).toStrictEqual('LR2,4');
		expect(c.size).toStrictEqual(2);
	});

	test('merges two collection, removing in-both entries', () => {
		const c = cL.merge(
			cR,
			(x) => ({ keep: true, value: `L${x}` }),
			(y) => ({ keep: true, value: `R${y}` }),
			() => ({ keep: false }),
		);
		expect(c.get('L')).toStrictEqual('L1');
		expect(c.get('R')).toStrictEqual('R3');
		expect(c.size).toStrictEqual(2);
	});
});

describe('partition() tests', () => {
	const coll = createTestCollection();

	test('throws if fn is not a function', () => {
		// @ts-expect-error: Invalid function
		expectInvalidFunctionError(() => coll.partition());
		// @ts-expect-error: Invalid function
		expectInvalidFunctionError(() => coll.partition(123), 123);
	});

	test('binds the thisArg', () => {
		coll.partition(function partition() {
			expect(this).toBeNull();
			return true;
		}, null);
	});

	test('partition a collection into two collections', () => {
		coll.set('d', 4);
		coll.set('e', 5);
		coll.set('f', 6);
		const [even, odd] = coll.partition((x) => x % 2 === 0);
		expect([...even.values()]).toStrictEqual([2, 4, 6]);
		expect([...odd.values()]).toStrictEqual([1, 3, 5]);
	});
});

describe('random() tests', () => {
	const coll = createTestCollection();

	test('returns undefined if the collection is empty', () => {
		expect(createCollection().random()).toBeUndefined();
	});

	test('returns empty array if the amount is 0', () => {
		expect(coll.random(0)).toStrictEqual([]);
	});

	test('returns an item if amount is not passed', () => {
		expect(coll.random()).toBeDefined();
	});

	test('random select from a collection', () => {
		const coll = createCollection();
		const chars = 'abcdefghijklmnopqrstuvwxyz';
		const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26];

		for (let i = 0; i < chars.length; i++) coll.set(chars[i]!, numbers[i]!);

		const random = coll.random(5);
		expect(random.length).toBe(5);

		const set = new Set(random);
		expect(set.size).toBe(random.length);
	});

	test('when random param > collection size', () => {
		const coll = createCollectionFrom(['a', 3], ['b', 2], ['c', 1]);

		const random = coll.random(5);
		expect(random.length).toEqual(coll.size);
	});
});

describe('randomKey() tests', () => {
	const coll = createTestCollection();

	test('returns undefined if the collection is empty', () => {
		expect(createCollection().randomKey()).toBeUndefined();
	});

	test('returns empty array if the amount is 0', () => {
		expect(coll.randomKey(0)).toStrictEqual([]);
	});

	test('returns a key', () => {
		expect(coll.randomKey()).toBeDefined();
	});

	test('returns n keys if the amount option is used', () => {
		expect(coll.randomKey(2)).toHaveLength(2);
	});
});

describe('reduce() tests', () => {
	const coll = createTestCollection();

	test('throws if fn is not a function', () => {
		// @ts-expect-error: Invalid function
		expectInvalidFunctionError(() => coll.reduce());
		// @ts-expect-error: Invalid function
		expectInvalidFunctionError(() => coll.reduce(123), 123);
	});

	test('reduce collection into a single value with initial value', () => {
		const sum = coll.reduce((a, x) => a + x, 0);
		expect<number>(sum).toStrictEqual(6);
	});

	test('reduce collection into a single value without initial value', () => {
		const sum = coll.reduce((a, x) => a + x);
		expect<number>(sum).toStrictEqual(6);
	});

	test('reduce collection into a single value with different accumulator type', () => {
		const str = coll.reduce((a, x) => a.concat(x.toString()), '');
		expect<string>(str).toStrictEqual('123');
	});

	test('reduce empty collection with initial value', () => {
		const coll = createCollection();
		expect<number>(coll.reduce((a, x) => a + x, 0)).toStrictEqual(0);
	});

	test('reduce empty collection without initial value', () => {
		const coll = createCollection();
		expect(() => coll.reduce((a, x) => a + x)).toThrowError(
			new TypeError('Reduce of empty collection with no initial value'),
		);
	});
});

describe('reduceRight() tests', () => {
	const coll = createTestCollection();

	test('throws if fn is not a function', () => {
		// @ts-expect-error: Invalid function
		expectInvalidFunctionError(() => coll.reduceRight());
		// @ts-expect-error: Invalid function
		expectInvalidFunctionError(() => coll.reduceRight(123), 123);
	});

	test('reduce collection into a single value with initial value', () => {
		const sum = coll.reduceRight((a, x) => a + x, 0);
		expect<number>(sum).toStrictEqual(6);
	});

	test('reduce collection into a single value without initial value', () => {
		const sum = coll.reduceRight((a, x) => a + x);
		expect<number>(sum).toStrictEqual(6);
	});

	test('reduce collection into a single value with different accumulator type', () => {
		const str = coll.reduceRight((a, x) => a.concat(x.toString()), '');
		expect<string>(str).toStrictEqual('321');
	});

	test('reduce empty collection with initial value', () => {
		const coll = createCollection();
		expect<number>(coll.reduceRight((a, x) => a + x, 0)).toStrictEqual(0);
	});

	test('reduce empty collection without initial value', () => {
		const coll = createCollection();
		expect(() => coll.reduceRight((a, x) => a + x)).toThrowError(
			new TypeError('Reduce of empty collection with no initial value'),
		);
	});
});

describe('reverse() tests', () => {
	test('reverts the collection', () => {
		const coll = createTestCollection();

		coll.reverse();

		expect([...coll.values()]).toStrictEqual([3, 2, 1]);
		expect([...coll.keys()]).toStrictEqual(['c', 'b', 'a']);
	});
});

describe('some() tests', () => {
	const coll = createTestCollection();

	test('throws if fn is not a function', () => {
		// @ts-expect-error: Invalid function
		expectInvalidFunctionError(() => coll.some());
		// @ts-expect-error: Invalid function
		expectInvalidFunctionError(() => coll.some(123), 123);
	});

	test('returns false if no items pass the predicate', () => {
		expect(coll.some((v) => v > 3)).toBeFalsy();
	});
});

describe('sort() tests', () => {
	test('sort a collection in place', () => {
		const coll = createCollectionFrom(['a', 3], ['b', 2], ['c', 1]);
		expect([...coll.values()]).toStrictEqual([3, 2, 1]);
		coll.sort((a, b) => a - b);
		expect([...coll.values()]).toStrictEqual([1, 2, 3]);
	});

	describe('defaultSort', () => {
		test('stays the same if it is already sorted', () => {
			const coll = createTestCollection();
			expect(coll.sort()).toStrictEqual(coll);
		});

		test('stays the same if it is already sorted', () => {
			const coll = createCollectionFrom(['a', 5], ['b', 3], ['c', 1]);
			expect(coll.sort()).toStrictEqual(createCollectionFrom(['c', 1], ['b', 3], ['a', 5]));
		});

		describe('returns correct sort order for test values', () => {
			const defaultSort = Collection['defaultSort']; // eslint-disable-line @typescript-eslint/dot-notation
			const testDefaultSortOrder = (firstValue: any, secondValue: any, result: number) => {
				expect(defaultSort(firstValue, secondValue)).toStrictEqual(result);
				expect(defaultSort(secondValue, firstValue)).toStrictEqual(result ? result * -1 : 0);
			};

			test('correctly evaluates sort order of undefined', () => {
				testDefaultSortOrder(undefined, undefined, 0);
				testDefaultSortOrder(0, undefined, -1);
			});

			test('correctly evaluates numeric values stringwise', () => {
				testDefaultSortOrder(-1, -2, -1); // "-1" before "-2"
				testDefaultSortOrder(1, '1', 0); // "1" equal to "1"
				testDefaultSortOrder(1, '1.0', -1); // "1" before "1.0"
				testDefaultSortOrder(1.1, '1.1', 0); // "1.1" equal to "1.1"
				testDefaultSortOrder('01', 1, -1); // "01" before "1"
				testDefaultSortOrder(1, 1n, 0); // "1" equal to "1"
				testDefaultSortOrder(Number.NaN, 'NaN', 0); // "NaN" equal to "NaN"
			});

			test('evaluates object literals as equal', () => {
				testDefaultSortOrder({ a: 1 }, { b: 2 }, 0);
			});
		});
	});
});

describe('sweep() test', () => {
	const coll = createTestCollection();

	test('throws if fn is not a function', () => {
		// @ts-expect-error: Invalid function
		expectInvalidFunctionError(() => coll.sweep());
		// @ts-expect-error: Invalid function
		expectInvalidFunctionError(() => coll.sweep(123), 123);
	});

	test('binds the thisArg', () => {
		coll.sweep(function sweep() {
			expect(this).toBeNull();
			return false;
		}, null);
	});

	test('sweep items from the collection', () => {
		const n1 = coll.sweep((x) => x === 2);
		expect(n1).toStrictEqual(1);
		expect([...coll.values()]).toStrictEqual([1, 3]);
		const n2 = coll.sweep((x) => x === 4);
		expect(n2).toStrictEqual(0);
		expect([...coll.values()]).toStrictEqual([1, 3]);
	});
});

describe('symmetricDifference() tests', () => {
	const coll1 = createCollectionFrom(['a', 1], ['b', 2], ['c', 3]);
	const coll2 = createCollectionFrom(['b', 2], ['d', 4], ['e', 5]);

	test('it returns the symmetric difference of the collections', () => {
		expect(coll1.symmetricDifference(coll2)).toStrictEqual(
			createCollectionFrom(['a', 1], ['c', 3], ['d', 4], ['e', 5]),
		);
	});
});

describe('tap() tests', () => {
	const coll = createTestCollection();

	test('throws if fn is not a function', () => {
		// @ts-expect-error: Invalid function
		expectInvalidFunctionError(() => coll.tap());
		// @ts-expect-error: Invalid function
		expectInvalidFunctionError(() => coll.tap(123), 123);
	});

	test('binds the thisArg', () => {
		coll.tap(function tap(c) {
			expect(this).toBeNull();
			expect(c).toStrictEqual(coll);
		}, null);
	});

	test('the collection should be the same', () => {
		coll.tap((c) => expect(c).toStrictEqual(coll));
	});
});

describe('toJSON() tests', () => {
	test('it returns the entries of the collection', () => {
		const c = createTestCollection();

		expect(c.toJSON()).toStrictEqual([
			['a', 1],
			['b', 2],
			['c', 3],
		]);
	});
});

describe('union() tests', () => {
	const coll1 = createCollectionFrom(['a', 1], ['b', 2]);
	const coll2 = createCollectionFrom(['a', 1], ['c', 3]);

	test('it returns the union of the collections', () => {
		const c = coll1.union(coll2);
		expect(c).toBeInstanceOf(Collection);
		expect(c.size).toStrictEqual(3);

		expect(c).toStrictEqual(createCollectionFrom(['a', 1], ['b', 2], ['c', 3]));
	});
});

describe('groupBy() tests', () => {
	test('returns a collection of grouped items', () => {
		const items = [
			{ name: 'Alice', age: 20 },
			{ name: 'Bob', age: 20 },
			{ name: 'Charlie', age: 30 },
		];

		expect<Collection<number, typeof items>>(Collection.groupBy(items, (item) => item.age)).toStrictEqual(
			new Collection<number, typeof items>([
				[
					20,
					[
						{ name: 'Alice', age: 20 },
						{ name: 'Bob', age: 20 },
					],
				],
				[30, [{ name: 'Charlie', age: 30 }]],
			]),
		);
	});
});

describe('toReversed() tests', () => {
	test('reverses a collection', () => {
		const coll = createTestCollection();
		const reversed = coll.toReversed();
		expect([...reversed.entries()]).toStrictEqual([
			['c', 3],
			['b', 2],
			['a', 1],
		]);
	});

	test('does not the modify original collection', () => {
		const coll = createTestCollection();
		const originalEntries = [...coll.entries()];
		const reversed = coll.toReversed();

		expect(reversed).not.toBe(coll);
		expect([...coll.entries()]).toStrictEqual(originalEntries);
	});
});

describe('toSorted() tests', () => {
	test('sorts a collection', () => {
		const coll = createCollectionFrom(['a', 3], ['b', 2], ['c', 1]);
		const sorted = coll.toSorted((a, b) => a - b);
		expect([...sorted.entries()]).toStrictEqual([
			['c', 1],
			['b', 2],
			['a', 3],
		]);
	});

	test('does not modify the original collection', () => {
		const coll = createCollectionFrom(['a', 3], ['b', 2], ['c', 1]);
		const originalEntries = [...coll.entries()];
		const sorted = coll.toSorted();

		expect(sorted).not.toBe(coll);
		expect([...coll.entries()]).toStrictEqual(originalEntries);
	});
});

describe('random thisArg tests', () => {
	const coll = createCollectionFrom(['a', 3], ['b', 2], ['c', 1]) as Collection<string, unknown>;

	const object = {};
	const string = 'Hi';
	const boolean = false;
	const symbol = Symbol('testArg');
	const array = [1, 2, 3];

	coll.set('d', object);
	coll.set('e', string);
	coll.set('f', boolean);
	coll.set('g', symbol);
	coll.set('h', array);

	test('thisArg test: number', () => {
		coll.some(function thisArgTest1(value) {
			expect(this.valueOf()).toStrictEqual(1);
			expect(typeof this).toEqual('number');
			return value === this;
		}, 1);
	});

	test('thisArg test: object', () => {
		coll.some(function thisArgTest2(value) {
			expect(this).toStrictEqual(object);
			expect(this.constructor === Object).toBeTruthy();
			return value === this;
		}, object);
	});

	test('thisArg test: string', () => {
		coll.some(function thisArgTest3(value) {
			expect(this.valueOf()).toStrictEqual(string);
			expect(typeof this).toEqual('string');
			return value === this;
		}, string);
	});

	test('thisArg test: boolean', () => {
		coll.some(function thisArgTest4(value) {
			expect(this.valueOf()).toStrictEqual(boolean);
			expect(typeof this).toEqual('boolean');
			return value === this;
		}, boolean);
	});

	test('thisArg test: symbol', () => {
		coll.some(function thisArgTest5(value) {
			expect(this.valueOf()).toStrictEqual(symbol);
			expect(typeof this).toEqual('symbol');
			return value === this;
		}, symbol);
	});

	test('thisArg test: array', () => {
		coll.some(function thisArgTest6(value) {
			expect(this).toStrictEqual(array);
			expect(Array.isArray(this)).toBeTruthy();
			return value === this;
		}, array);
	});
});

describe('findLast() tests', () => {
	const coll = createTestCollection();
	test('it returns last matched element', () => {
		expect(coll.findLast((value) => value % 2 === 1)).toStrictEqual(3);
	});

	test('returns undefined if no item matches', () => {
		expect(coll.findLast((value) => value === 10)).toBeUndefined();
	});

	test('throws if fn is not a function', () => {
		// @ts-expect-error: Invalid function
		expectInvalidFunctionError(() => createCollection().findLast());
		// @ts-expect-error: Invalid function
		expectInvalidFunctionError(() => createCollection().findLast(123), 123);
	});

	test('binds the thisArg', () => {
		coll.findLast(function findLast() {
			expect(this).toBeNull();
			return true;
		}, null);
	});
});

describe('findLastKey() tests', () => {
	const coll = createTestCollection();
	test('it returns last matched element', () => {
		expect(coll.findLastKey((value) => value % 2 === 1)).toStrictEqual('c');
	});

	test('returns undefined if no item matches', () => {
		expect(coll.findLastKey((value) => value === 10)).toBeUndefined();
	});

	test('throws if fn is not a function', () => {
		// @ts-expect-error: Invalid function
		expectInvalidFunctionError(() => createCollection().findLastKey());
		// @ts-expect-error: Invalid function
		expectInvalidFunctionError(() => createCollection().findLastKey(123), 123);
	});

	test('binds the thisArg', () => {
		coll.findLastKey(function findLastKey() {
			expect(this).toBeNull();
			return true;
		}, null);
	});
});

describe('subclassing tests', () => {
	class DerivedCollection<Key, Value> extends Collection<Key, Value> {}

	test('constructor[Symbol.species]', () => {
		expect(DerivedCollection[Symbol.species]).toStrictEqual(DerivedCollection);
	});

	describe('methods that construct new collections return subclassed objects', () => {
		const coll = new DerivedCollection();

		test('filter()', () => {
			expect(coll.filter(Boolean)).toBeInstanceOf(DerivedCollection);
		});
		test('partition()', () => {
			for (const partition of coll.partition(Boolean)) {
				expect(partition).toBeInstanceOf(DerivedCollection);
			}
		});
		test('flatMap()', () => {
			expect(coll.flatMap(() => new Collection())).toBeInstanceOf(DerivedCollection);
		});
		test('mapValues()', () => {
			expect(coll.mapValues(Object)).toBeInstanceOf(DerivedCollection);
		});
		test('clone()', () => {
			expect(coll.clone()).toBeInstanceOf(DerivedCollection);
		});
		test('intersection()', () => {
			expect(coll.intersection(new Collection())).toBeInstanceOf(DerivedCollection);
		});
		test('union()', () => {
			expect(coll.union(new Collection())).toBeInstanceOf(DerivedCollection);
		});
		test('difference()', () => {
			expect(coll.difference(new Collection())).toBeInstanceOf(DerivedCollection);
		});
		test('symmetricDifference()', () => {
			expect(coll.symmetricDifference(new Collection())).toBeInstanceOf(DerivedCollection);
		});
		test('merge()', () => {
			const fn = () => ({ keep: false }) as const; // eslint-disable-line unicorn/consistent-function-scoping
			expect(coll.merge(new Collection(), fn, fn, fn)).toBeInstanceOf(DerivedCollection);
		});
		test('toReversed()', () => {
			expect(coll.toReversed()).toBeInstanceOf(DerivedCollection);
		});
		test('toSorted()', () => {
			expect(coll.toSorted()).toBeInstanceOf(DerivedCollection);
		});
		test('Collection.combineEntries()', () => {
			expect(DerivedCollection.combineEntries([], Object)).toBeInstanceOf(DerivedCollection);
		});
		test('Collection.groupBy()', () => {
			expect(DerivedCollection.groupBy([], Object)).toBeInstanceOf(DerivedCollection);
		});
	});
});
