/* eslint-disable unicorn/no-array-method-this-argument */
/* eslint-disable id-length */
import { Collection } from '@discordjs/collection';
import Redis from 'ioredis';
import { RedisMemoryServer } from 'redis-memory-server';
import { describe, test, expect } from 'vitest';
import { RedisCollection } from '../src/index.js';

const redisServer = new RedisMemoryServer();
const host = await redisServer.getHost();
const port = await redisServer.getPort();

const redis = new Redis({
	host,
	port,
});

type TestCollection = RedisCollection<number>;

function createCollection(): TestCollection {
	return new RedisCollection({
		redis,
		hash: `test-${Date.now()}`,
	});
}

function createCollectionFrom(...entries: [key: string, value: number][]): TestCollection {
	return new RedisCollection(
		{
			redis,
			hash: `test-${Date.now()}-${Math.random()}`,
		},
		entries,
	);
}

function createTestCollection(): TestCollection {
	return createCollectionFrom(['a', 1], ['b', 2], ['c', 3]);
}

async function expectInvalidFunctionError(cb: () => Promise<unknown>, val?: unknown): Promise<void> {
	await expect(
		// eslint-disable-next-line promise/prefer-await-to-callbacks
		async () => cb(),
		// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
	).rejects.toThrowError(new TypeError(`${val} is not a function`));
}

test('do basic map operations', async () => {
	const coll = createCollectionFrom(['a', 1]);
	await expect(coll.size).resolves.toEqual(1);
	await expect(coll.has('a')).resolves.toBeTruthy();
	await expect(coll.get('a')).resolves.toStrictEqual(1);
	await coll.delete('a');
	await expect(coll.has('a')).resolves.toBeFalsy();
	await expect(coll.get('a')).resolves.toBeUndefined();
	await coll.clear();
	await expect(coll.size).resolves.toStrictEqual(0);
});

test('shallow clone the collection', async () => {
	const coll = createTestCollection();
	const clone = await coll.clone(`cloned-${Date.now()}-${Math.random()}`);
	const prevValues = await coll.valuesArray();

	const newValues = await clone.valuesArray();
	expect(prevValues).toStrictEqual(newValues);
});

test('merge multiple collections', async () => {
	const coll1 = createCollectionFrom(['a', 1]);
	const coll2 = createCollectionFrom(['b', 2]);
	const coll3 = createCollectionFrom(['c', 3]);
	const merged = await coll1.concat(`concat-${Date.now()}-${Math.random()}`, coll2, coll3);
	expect([...(await merged.valuesArray())]).toStrictEqual([1, 2, 3]);
	expect(coll1 !== merged).toBeTruthy();
});

test('check equality of two collections', async () => {
	const coll1 = createCollectionFrom(['a', 1]);
	const coll2 = createCollectionFrom(['a', 1]);
	await expect(coll1.equals(coll2)).resolves.toBeTruthy();
	await coll2.set('b', 2);
	await expect(coll1.equals(coll2)).resolves.toBeFalsy();
	await coll2.clear();
	await expect(coll1.equals(coll2)).resolves.toBeFalsy();
});

// Specific method tests

describe('at() tests', () => {
	const coll = createTestCollection();

	test('positive index', async () => {
		await expect(coll.at(0)).resolves.toStrictEqual(1);
	});

	test('negative index', async () => {
		await expect(coll.at(-1)).resolves.toStrictEqual(3);
	});

	test('invalid positive index', async () => {
		await expect(coll.at(4)).resolves.toBeUndefined();
	});

	test('invalid negative index', async () => {
		await expect(coll.at(-4)).resolves.toBeUndefined();
	});
});

describe('combineEntries() tests', () => {
	test('it adds entries together', async () => {
		const c = await RedisCollection.combineEntries(
			{
				redis,
				hash: `test-${Date.now()}-${Math.random()}`,
			},
			[
				['a', 1],
				['b', 2],
				['a', 2],
			],
			(x, y) => x + y,
		);
		expect([...(await c.entriesArray())]).toStrictEqual([
			['a', 3],
			['b', 2],
		]);
	});

	test('it really goes through all the entries', async () => {
		const c = await RedisCollection.combineEntries(
			{
				redis,
				hash: `test-${Date.now()}-${Math.random()}`,
			},
			[
				['a', [1]],
				['b', [2]],
				['a', [2]],
			],
			(x, y) => x.concat(y),
		);
		expect([...(await c.entriesArray())]).toStrictEqual([
			['a', [1, 2]],
			['b', [2]],
		]);
	});
});

describe('difference() tests', () => {
	const coll1 = createCollectionFrom(['a', 1], ['b', 2]);
	const coll2 = createTestCollection();
	const diff = new Collection([['c', 3]]);

	test('it removes entries from the bigger collection on the right', async () => {
		await expect(coll1.difference(coll2)).resolves.toStrictEqual(diff);
	});

	test('removes the difference from the bigger collection on the left', async () => {
		await expect(coll2.difference(coll1)).resolves.toStrictEqual(diff);
	});
});

describe('each() tests', () => {
	const coll = createTestCollection();

	test('throws if fn is not a function', async () => {
		// @ts-expect-error: Invalid function
		await expectInvalidFunctionError(async () => coll.each());
		// @ts-expect-error: Invalid function
		await expectInvalidFunctionError(async () => coll.each(123), 123);
	});

	test('iterate over each item', async () => {
		const coll = createTestCollection();
		const a: [string, number][] = [];
		await coll.each((v, k) => a.push([k, v]));
		expect(a).toStrictEqual([
			['a', 1],
			['b', 2],
			['c', 3],
		]);
	});
});

describe('ensure() tests', () => {
	test('throws if defaultValueGenerator is not a function', async () => {
		const coll = createTestCollection();
		// @ts-expect-error: Invalid function
		await expectInvalidFunctionError(async () => coll.ensure('d', 'abc'), 'abc');
	});

	test('set new value if key does not exist', async () => {
		const coll = createTestCollection();
		await coll.ensure('d', () => 4);
		await expect(coll.size).resolves.toStrictEqual(4);
		await expect(coll.get('d')).resolves.toStrictEqual(4);
	});

	test('return existing value if key exists', async () => {
		const coll = createTestCollection();
		await expect(coll.ensure('b', () => 3)).resolves.toStrictEqual(2);
		await expect(coll.get('b')).resolves.toStrictEqual(2);
		await expect(coll.size).resolves.toStrictEqual(3);
	});
});

describe('equals() tests', () => {
	const coll1 = createCollectionFrom(['a', 1], ['b', 2]);
	const coll2 = createTestCollection();

	test('returns false if no collection is passed', async () => {
		// @ts-expect-error: Invalid function
		await expect(coll1.equals()).resolves.toBeFalsy();
	});

	test('the same collection should be equal to itself', async () => {
		await expect(coll1.equals(coll1)).resolves.toBeTruthy();
	});

	test('collections with different sizes should not be equal', async () => {
		await expect(coll1.equals(coll2)).resolves.toBeFalsy();
	});

	test('collections with the same size but differing items should not be equal', async () => {
		const coll3 = createCollectionFrom(['a', 2], ['b', 3], ['c', 3]);
		await expect(coll2.equals(coll3)).resolves.toBeFalsy();
	});
});

describe('every() tests', () => {
	const coll = createTestCollection();

	test('throws if fn is not a function', async () => {
		// @ts-expect-error: Invalid function
		await expectInvalidFunctionError(async () => coll.every());
		// @ts-expect-error: Invalid function
		await expectInvalidFunctionError(async () => coll.every(123), 123);
	});

	test('binds the thisArg', async () => {
		await coll.every(function every() {
			expect(this).toBeNull();
			return true;
		}, null);
	});

	test('returns true if every item passes the predicate', async () => {
		await expect(coll.every((v) => v < 4)).resolves.toBeTruthy();
	});

	test("returns false if at least one item doesn't pass the predicate", async () => {
		await expect(coll.every((x) => x === 2)).resolves.toBeFalsy();
	});
});

describe('filter() tests', () => {
	const coll = createTestCollection();

	test('throws if fn is not a function', async () => {
		// @ts-expect-error: Invalid function
		await expectInvalidFunctionError(async () => coll.filter());
		// @ts-expect-error: Invalid function
		await expectInvalidFunctionError(async () => coll.filter(123), 123);
	});

	test('binds the thisArg', async () => {
		await coll.filter(function filter() {
			expect(this).toBeNull();
			return true;
		}, null);
	});

	test('filter items from the collection', async () => {
		const coll = createTestCollection();

		const filtered = await coll.filter((x) => x % 2 === 1);
		await expect(coll.size).resolves.toStrictEqual(3);
		expect(filtered.size).toStrictEqual(2);
		expect([...filtered.values()]).toStrictEqual([1, 3]);
	});
});

describe('find() tests', () => {
	const coll = createTestCollection();

	test('throws if fn is not a function', async () => {
		// @ts-expect-error: Invalid function
		await expectInvalidFunctionError(async () => createCollection().find());
		// @ts-expect-error: Invalid function
		await expectInvalidFunctionError(async () => createCollection().find(123), 123);
	});

	test('binds the thisArg', async () => {
		await coll.find(function find() {
			expect(this).toBeNull();
			return true;
		}, null);
	});

	test('find an item in the collection', async () => {
		const coll = createTestCollection();
		await expect(coll.find((x) => x === 1)).resolves.toStrictEqual(1);
		await expect(coll.find((x) => x === 10)).resolves.toBeUndefined();
	});
});

describe('findKey() tests', () => {
	const coll = createTestCollection();

	test('throws if fn is not a function', async () => {
		// @ts-expect-error: Invalid function
		await expectInvalidFunctionError(async () => coll.findKey());
		// @ts-expect-error: Invalid function
		await expectInvalidFunctionError(async () => coll.findKey(123), 123);
	});

	test('binds the thisArg', async () => {
		await coll.findKey(function findKey() {
			expect(this).toBeNull();
			return true;
		}, null);
	});

	test('should find a key', async () => {
		await expect(coll.findKey((v) => v === 2)).resolves.toEqual('b');
	});

	test('returns undefined if no key matches', async () => {
		await expect(coll.findKey(() => false)).resolves.toBeUndefined();
	});
});

describe('first() tests', () => {
	const coll = createTestCollection();

	test('returns undefined if the collection is empty', async () => {
		await expect(createCollection().first()).resolves.toBeUndefined();
	});

	test('returns the first value', async () => {
		await expect(coll.first()).resolves.toStrictEqual(1);
	});

	test('returns empty array if amount is 0', async () => {
		await expect(coll.first(0)).resolves.toStrictEqual([]);
	});

	test('returns the values from the end if amount is negative', async () => {
		await expect(coll.first(-2)).resolves.toStrictEqual([2, 3]);
	});

	test('returns the first value of the collection', async () => {
		await expect(coll.first()).resolves.toStrictEqual(1);
	});

	test('returns all values of the collection when the amount is equal to the size', async () => {
		await expect(coll.first(3)).resolves.toStrictEqual([1, 2, 3]);
	});

	test('returns all values of the collection when the amount is bigger than the size', async () => {
		await expect(coll.first(4)).resolves.toStrictEqual([1, 2, 3]);
	});
});

describe('firstKey() tests', () => {
	const coll = createTestCollection();

	test('returns undefined if the collection is empty', async () => {
		await expect(createCollection().firstKey()).resolves.toBeUndefined();
	});

	test('returns the first key', async () => {
		await expect(coll.firstKey()).resolves.toStrictEqual('a');
	});

	test('returns empty array if amount is 0', async () => {
		await expect(coll.firstKey(0)).resolves.toStrictEqual([]);
	});

	test('returns the keys from the end if amount is negative', async () => {
		await expect(coll.firstKey(-2)).resolves.toStrictEqual(['b', 'c']);
	});

	test('returns the keys from the beginning if amount is positive', async () => {
		await expect(coll.firstKey(2)).resolves.toEqual(['a', 'b']);
	});

	test('returns all keys of the collection when the amount is equal to the size', async () => {
		await expect(coll.firstKey(3)).resolves.toStrictEqual(['a', 'b', 'c']);
	});

	test('returns all keys of the collection when the amount is bigger than the size', async () => {
		await expect(coll.firstKey(3)).resolves.toStrictEqual(['a', 'b', 'c']);
	});
});

describe('hasAll() tests', () => {
	const coll = createTestCollection();

	test('all keys exist in the collection', async () => {
		await expect(coll.hasAll('a', 'b', 'c')).resolves.toBeTruthy();
	});

	test('some keys exist in the collection', async () => {
		await expect(coll.hasAll('b', 'c', 'd')).resolves.toBeFalsy();
	});

	test('no keys exist in the collection', async () => {
		await expect(coll.hasAll('d', 'e')).resolves.toBeFalsy();
	});
});

describe('hasAny() tests', () => {
	const coll = createTestCollection();

	test('all keys exist in the collection', async () => {
		await expect(coll.hasAny('a', 'b')).resolves.toBeTruthy();
	});

	test('some keys exist in the collection', async () => {
		await expect(coll.hasAny('c', 'd')).resolves.toBeTruthy();
	});

	test('no keys exist in the collection', async () => {
		await expect(coll.hasAny('d', 'e')).resolves.toBeFalsy();
	});
});

describe('intersect() tests', () => {
	const coll1 = createCollectionFrom(['a', 1], ['b', 2]);
	const coll2 = createCollectionFrom(['a', 1], ['c', 3]);

	test('it returns a new collection', async () => {
		const c = await coll1.intersect(coll2);
		expect(c).toBeInstanceOf(Collection);
		expect(c.size).toStrictEqual(1);

		expect(c).toStrictEqual(new Collection([['a', 1]]));
	});
});

describe('keyAt() tests', () => {
	const coll = createTestCollection();

	test('positive index', async () => {
		await expect(coll.keyAt(0)).resolves.toStrictEqual('a');
	});

	test('negative index', async () => {
		await expect(coll.keyAt(-1)).resolves.toStrictEqual('c');
	});

	test('invalid positive index', async () => {
		await expect(coll.keyAt(4)).resolves.toBeUndefined();
	});

	test('invalid negative index', async () => {
		await expect(coll.keyAt(-4)).resolves.toBeUndefined();
	});
});

describe('last() tests', () => {
	const coll = createTestCollection();

	test('returns undefined if the collection is empty', async () => {
		await expect(createCollection().last()).resolves.toBeUndefined();
	});

	test('returns the last value', async () => {
		await expect(coll.last()).resolves.toStrictEqual(3);
	});

	test('returns empty array if amount is 0', async () => {
		await expect(coll.last(0)).resolves.toStrictEqual([]);
	});

	test('returns the values from the beginning if amount is negative', async () => {
		await expect(coll.last(-2)).resolves.toStrictEqual([1, 2]);
	});

	test('returns the last value of the collection', async () => {
		await expect(coll.last()).resolves.toStrictEqual(3);
	});

	test('returns all values of the collection when the amount is equal to the size', async () => {
		await expect(coll.last(3)).resolves.toStrictEqual([1, 2, 3]);
	});

	test('returns all values of the collection when the amount is bigger than the size', async () => {
		await expect(coll.last(4)).resolves.toStrictEqual([1, 2, 3]);
	});
});

describe('lastKey() tests', () => {
	const coll = createTestCollection();

	test('returns undefined if the collection is empty', async () => {
		await expect(createCollection().lastKey()).resolves.toBeUndefined();
	});

	test('returns the last key', async () => {
		await expect(coll.lastKey()).resolves.toStrictEqual('c');
	});

	test('returns empty array if amount is 0', async () => {
		await expect(coll.lastKey(0)).resolves.toStrictEqual([]);
	});

	test('returns the keys from the beginning if amount is negative', async () => {
		await expect(coll.lastKey(-2)).resolves.toStrictEqual(['a', 'b']);
	});

	test('returns the last n keys if the amount option is used', async () => {
		await expect(coll.lastKey(2)).resolves.toStrictEqual(['b', 'c']);
	});

	test('returns all keys of the collection when the amount is equal to the size', async () => {
		await expect(coll.lastKey(3)).resolves.toStrictEqual(['a', 'b', 'c']);
	});

	test('returns all keys of the collection when the amount is bigger than the size', async () => {
		await expect(coll.lastKey(4)).resolves.toStrictEqual(['a', 'b', 'c']);
	});
});

describe('map() tests', () => {
	const coll = createTestCollection();

	test('throws if fn is not a function', async () => {
		// @ts-expect-error: Invalid function
		await expectInvalidFunctionError(async () => coll.map());
		// @ts-expect-error: Invalid function
		await expectInvalidFunctionError(async () => coll.map(123), 123);
	});

	test('binds the thisArg', async () => {
		await coll.map(function map() {
			expect(this).toBeNull();
			return true;
		}, null);
	});

	test('map items in a collection into an array', async () => {
		const mapped = await coll.map((x) => x + 1);
		expect(mapped).toStrictEqual([2, 3, 4]);
	});
});

describe('mapValues() tests', () => {
	const coll = createTestCollection();

	test('throws if fn is not a function', async () => {
		// @ts-expect-error: Invalid function
		await expectInvalidFunctionError(async () => coll.mapValues());
		// @ts-expect-error: Invalid function
		await expectInvalidFunctionError(async () => coll.mapValues(123), 123);
	});

	test('binds the thisArg', async () => {
		await coll.mapValues(function mapValues() {
			expect(this).toBeNull();
			return true;
		}, null);
	});

	test('map items in a collection into a collection', async () => {
		const mapped = await coll.mapValues((x) => x + 1);
		expect([...mapped.values()]).toStrictEqual([2, 3, 4]);
	});
});

describe('merge() tests', () => {
	const cL = createCollectionFrom(['L', 1], ['LR', 2]);
	const cR = createCollectionFrom(['R', 3], ['LR', 4]);

	test('merges two collection, with all keys together', async () => {
		const c = await cL.merge(
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

	test('merges two collection, removing left entries', async () => {
		const c = await cL.merge(
			cR,
			() => ({ keep: false }),
			(y) => ({ keep: true, value: `R${y}` }),
			(x, y) => ({ keep: true, value: `LR${x},${y}` }),
		);
		expect(c.get('R')).toStrictEqual('R3');
		expect(c.get('LR')).toStrictEqual('LR2,4');
		expect(c.size).toStrictEqual(2);
	});

	test('merges two collection, removing right entries', async () => {
		const c = await cL.merge(
			cR,
			(x) => ({ keep: true, value: `L${x}` }),
			() => ({ keep: false }),
			(x, y) => ({ keep: true, value: `LR${x},${y}` }),
		);
		expect(c.get('L')).toStrictEqual('L1');
		expect(c.get('LR')).toStrictEqual('LR2,4');
		expect(c.size).toStrictEqual(2);
	});

	test('merges two collection, removing in-both entries', async () => {
		const c = await cL.merge(
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

	test('throws if fn is not a function', async () => {
		// @ts-expect-error: Invalid function
		await expectInvalidFunctionError(async () => coll.partition());
		// @ts-expect-error: Invalid function
		await expectInvalidFunctionError(async () => coll.partition(123), 123);
	});

	test('binds the thisArg', async () => {
		await coll.partition(function partition() {
			expect(this).toBeNull();
			return true;
		}, null);
	});

	test('partition a collection into two collections', async () => {
		await coll.set('d', 4);
		await coll.set('e', 5);
		await coll.set('f', 6);
		const [even, odd] = await coll.partition((x) => x % 2 === 0);
		expect([...even.values()]).toStrictEqual([2, 4, 6]);
		expect([...odd.values()]).toStrictEqual([1, 3, 5]);
	});
});

describe('random() tests', () => {
	const coll = createTestCollection();

	test('returns undefined if the collection is empty', async () => {
		await expect(createCollection().random()).resolves.toBeUndefined();
	});

	test('returns empty array if the amount is 0', async () => {
		await expect(coll.random(0)).resolves.toStrictEqual([]);
	});

	test('returns an item if amount is not passed', async () => {
		await expect(coll.random()).resolves.toBeDefined();
	});

	test('random select from a collection', async () => {
		const coll = createCollection();
		const chars = 'abcdefghijklmnopqrstuvwxyz';
		const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26];

		for (let i = 0; i < chars.length; i++) await coll.set(chars[i]!, numbers[i]!);

		const random = await coll.random(5);
		expect(random.length).toBe(5);

		const set = new Set(random);
		expect(set.size).toBe(random.length);
	});

	test('when random param > collection size', async () => {
		const coll = createCollectionFrom(['a', 3], ['b', 2], ['c', 1]);

		const random = await coll.random(5);
		expect(random.length).toEqual(await coll.size);
	});
});

describe('randomKey() tests', () => {
	const coll = createTestCollection();

	test('returns undefined if the collection is empty', async () => {
		await expect(createCollection().randomKey()).resolves.toBeUndefined();
	});

	test('returns empty array if the amount is 0', async () => {
		await expect(coll.randomKey(0)).resolves.toStrictEqual([]);
	});

	test('returns a key', async () => {
		await expect(coll.randomKey()).resolves.toBeDefined();
	});

	test('returns n keys if the amount option is used', async () => {
		await expect(coll.randomKey(2)).resolves.toHaveLength(2);
	});
});

describe('reduce() tests', () => {
	const coll = createTestCollection();

	test('throws if fn is not a function', async () => {
		// @ts-expect-error: Invalid function
		await expectInvalidFunctionError(async () => coll.reduce());
		// @ts-expect-error: Invalid function
		await expectInvalidFunctionError(async () => coll.reduce(123), 123);
	});

	test('reduce collection into a single value with initial value', async () => {
		const sum = await coll.reduce((a, x) => a + x, 0);
		expect(sum).toStrictEqual(6);
	});

	test('reduce collection into a single value without initial value', async () => {
		const sum = await coll.reduce<number>((a, x) => a + x);
		expect(sum).toStrictEqual(6);
	});

	test('reduce empty collection without initial value', async () => {
		const coll = createCollection();
		await expect(async () => coll.reduce((a: number, x) => a + x)).rejects.toThrowError(
			new TypeError('Reduce of empty collection with no initial value'),
		);
	});
});

describe('reverse() tests', () => {
	test('reverts the collection', async () => {
		const coll = createTestCollection();

		await coll.reverse();

		expect([...(await coll.valuesArray())]).toStrictEqual([3, 2, 1]);
		expect([...(await coll.keysArray())]).toStrictEqual(['c', 'b', 'a']);
	});
});

describe('some() tests', () => {
	const coll = createTestCollection();

	test('throws if fn is not a function', async () => {
		// @ts-expect-error: Invalid function
		await expectInvalidFunctionError(async () => coll.some());
		// @ts-expect-error: Invalid function
		await expectInvalidFunctionError(async () => coll.some(123), 123);
	});

	test('returns false if no items pass the predicate', async () => {
		await expect(coll.some((v) => v > 3)).resolves.toBeFalsy();
	});
});

describe('sort() tests', () => {
	test('sort a collection in place', async () => {
		const coll = createCollectionFrom(['a', 3], ['b', 2], ['c', 1]);
		expect([...(await coll.valuesArray())]).toStrictEqual([3, 2, 1]);
		await coll.sort((a, b) => a - b);
		expect([...(await coll.valuesArray())]).toStrictEqual([1, 2, 3]);
	});

	test('sort a collection', async () => {
		const coll = createCollectionFrom(['a', 3], ['b', 2], ['c', 1]);
		expect([...(await coll.valuesArray())]).toStrictEqual([3, 2, 1]);
		const sorted = await coll.sorted((a, b) => a - b);
		expect([...(await coll.valuesArray())]).toStrictEqual([3, 2, 1]);
		expect([...sorted.values()]).toStrictEqual([1, 2, 3]);
	});

	describe('defaultSort', () => {
		test('stays the same if it is already sorted', async () => {
			const redisColl = createTestCollection();
			const coll = await redisColl.toCollection();
			const sortedColl = await redisColl.sort();
			await expect(sortedColl.toCollection()).resolves.toStrictEqual(coll);
		});

		test('stays the same if it is already sorted', async () => {
			const redisColl = createCollectionFrom(['a', 5], ['b', 3], ['c', 1]);
			const sortedColl = await redisColl.sort();
			const coll = await createCollectionFrom(['c', 1], ['b', 3], ['a', 5]).toCollection();
			await expect(sortedColl.toCollection()).resolves.toStrictEqual(coll);
		});
	});
});

describe('sweep() test', () => {
	const coll = createTestCollection();

	test('throws if fn is not a function', async () => {
		// @ts-expect-error: Invalid function
		await expectInvalidFunctionError(async () => coll.sweep());
		// @ts-expect-error: Invalid function
		await expectInvalidFunctionError(async () => coll.sweep(123), 123);
	});

	test('binds the thisArg', async () => {
		await coll.sweep(function sweep() {
			expect(this).toBeNull();
			return false;
		}, null);
	});

	test('sweep items from the collection', async () => {
		const n1 = await coll.sweep((x) => x === 2);
		expect(n1).toStrictEqual(1);
		expect([...(await coll.valuesArray())]).toStrictEqual([1, 3]);
		const n2 = await coll.sweep((x) => x === 4);
		expect(n2).toStrictEqual(0);
		expect([...(await coll.valuesArray())]).toStrictEqual([1, 3]);
	});
});
describe('tap() tests', () => {
	const coll = createTestCollection();

	test('throws if fn is not a function', async () => {
		// @ts-expect-error: Invalid function
		await expectInvalidFunctionError(() => coll.tap());
		// @ts-expect-error: Invalid function
		await expectInvalidFunctionError(() => coll.tap(123), 123);
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

describe('random thisArg tests', async () => {
	const coll = createCollectionFrom(['a', 3], ['b', 2], ['c', 1]) as RedisCollection<any>;

	const object = {};
	const string = 'Hi';
	const boolean = false;
	const array = [1, 2, 3];

	await coll.set('d', object);
	await coll.set('e', string);
	await coll.set('f', boolean);
	await coll.set('g', array);

	test('thisArg test: number', async () => {
		await coll.some(function thisArgTest1(value) {
			expect(this.valueOf()).toStrictEqual(1);
			expect(typeof this).toEqual('number');
			return value === this;
		}, 1);
	});

	test('thisArg test: object', async () => {
		await coll.some(function thisArgTest2(value) {
			expect(this).toStrictEqual(object);
			expect(this.constructor === Object).toBeTruthy();
			return value === this;
		}, object);
	});

	test('thisArg test: string', async () => {
		await coll.some(function thisArgTest3(value) {
			expect(this.valueOf()).toStrictEqual(string);
			expect(typeof this).toEqual('string');
			return value === this;
		}, string);
	});

	test('thisArg test: boolean', async () => {
		await coll.some(function thisArgTest4(value) {
			expect(this.valueOf()).toStrictEqual(boolean);
			expect(typeof this).toEqual('boolean');
			return value === this;
		}, boolean);
	});

	test('thisArg test: array', async () => {
		await coll.some(function thisArgTest6(value) {
			expect(this).toStrictEqual(array);
			expect(Array.isArray(this)).toBeTruthy();
			return value === this;
		}, array);
	});
});
