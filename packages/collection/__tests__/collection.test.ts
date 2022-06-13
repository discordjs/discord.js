import { describe, test, expect } from 'vitest';
import { Collection } from '../src';

type TestCollection = Collection<string, number>;

test('do basic map operations', () => {
	const coll: TestCollection = new Collection();
	coll.set('a', 1);
	expect(coll.size).toEqual(1);
	expect(coll.has('a')).toBeTruthy();
	expect(coll.get('a')).toStrictEqual(1);
	coll.delete('a');
	expect(coll.has('a')).toBeFalsy();
	expect(coll.get('a')).toStrictEqual(undefined);
	coll.clear();
	expect(coll.size).toStrictEqual(0);
});

test('get the first item of the collection', () => {
	const coll: TestCollection = new Collection();
	coll.set('a', 1);
	coll.set('b', 2);
	expect(coll.first()).toStrictEqual(1);
});

test('get the first 3 items of the collection where size equals', () => {
	const coll: TestCollection = new Collection();
	coll.set('a', 1);
	coll.set('b', 2);
	coll.set('c', 3);
	expect(coll.first(3)).toStrictEqual([1, 2, 3]);
});

test('get the first 3 items of the collection where size is less', () => {
	const coll: TestCollection = new Collection();
	coll.set('a', 1);
	coll.set('b', 2);
	expect(coll.first(3)).toStrictEqual([1, 2]);
});

test('get the last item of the collection', () => {
	const coll: TestCollection = new Collection();
	coll.set('a', 1);
	coll.set('b', 2);
	expect(coll.last()).toStrictEqual(2);
});

test('get the last 3 items of the collection', () => {
	const coll: TestCollection = new Collection();
	coll.set('a', 1);
	coll.set('b', 2);
	coll.set('c', 3);
	expect(coll.last(3)).toStrictEqual([1, 2, 3]);
});

test('get the last 3 items of the collection where size is less', () => {
	const coll: TestCollection = new Collection();
	coll.set('a', 1);
	coll.set('b', 2);
	expect(coll.last(3)).toStrictEqual([1, 2]);
});

test('find an item in the collection', () => {
	const coll: TestCollection = new Collection();
	coll.set('a', 1);
	coll.set('b', 2);
	expect(coll.find((x) => x === 1)).toStrictEqual(1);
	expect(coll.find((x) => x === 10)).toStrictEqual(undefined);
});

test('sweep items from the collection', () => {
	const coll: TestCollection = new Collection();
	coll.set('a', 1);
	coll.set('b', 2);
	coll.set('c', 3);
	const n1 = coll.sweep((x) => x === 2);
	expect(n1).toStrictEqual(1);
	expect([...coll.values()]).toStrictEqual([1, 3]);
	const n2 = coll.sweep((x) => x === 4);
	expect(n2).toStrictEqual(0);
	expect([...coll.values()]).toStrictEqual([1, 3]);
});

test('filter items from the collection', () => {
	const coll: TestCollection = new Collection();
	coll.set('a', 1);
	coll.set('b', 2);
	coll.set('c', 3);
	const filtered = coll.filter((x) => x % 2 === 1);
	expect(coll.size).toStrictEqual(3);
	expect(filtered.size).toStrictEqual(2);
	expect([...filtered.values()]).toStrictEqual([1, 3]);
});

test('partition a collection into two collections', () => {
	const coll: TestCollection = new Collection();
	coll.set('a', 1);
	coll.set('b', 2);
	coll.set('c', 3);
	coll.set('d', 4);
	coll.set('e', 5);
	coll.set('f', 6);
	const [even, odd] = coll.partition((x) => x % 2 === 0);
	expect([...even.values()]).toStrictEqual([2, 4, 6]);
	expect([...odd.values()]).toStrictEqual([1, 3, 5]);
});

test('map items in a collection into an array', () => {
	const coll: TestCollection = new Collection();
	coll.set('a', 1);
	coll.set('b', 2);
	coll.set('c', 3);
	const mapped = coll.map((x) => x + 1);
	expect(mapped).toStrictEqual([2, 3, 4]);
});

test('map items in a collection into a collection', () => {
	const coll: TestCollection = new Collection();
	coll.set('a', 1);
	coll.set('b', 2);
	coll.set('c', 3);
	const mapped = coll.mapValues((x) => x + 1);
	expect([...mapped.values()]).toStrictEqual([2, 3, 4]);
});

test('flatMap items in a collection into a single collection', () => {
	const coll = new Collection<string, { a: Collection<string, number> }>();
	const coll1 = new Collection<string, number>();
	const coll2 = new Collection<string, number>();
	coll1.set('z', 1);
	coll1.set('x', 2);
	coll2.set('c', 3);
	coll2.set('v', 4);
	coll.set('a', { a: coll1 });
	coll.set('b', { a: coll2 });
	const mapped = coll.flatMap((x) => x.a);
	expect([...mapped.values()]).toStrictEqual([1, 2, 3, 4]);
});

test('check if some items pass a predicate', () => {
	const coll: TestCollection = new Collection();
	coll.set('a', 1);
	coll.set('b', 2);
	coll.set('c', 3);
	expect(coll.some((x) => x === 2)).toBeTruthy();
});

test('check if every items pass a predicate', () => {
	const coll: TestCollection = new Collection();
	coll.set('a', 1);
	coll.set('b', 2);
	coll.set('c', 3);
	expect(!coll.every((x) => x === 2)).toBeTruthy();
});

test('reduce collection into a single value with initial value', () => {
	const coll: TestCollection = new Collection();
	coll.set('a', 1);
	coll.set('b', 2);
	coll.set('c', 3);
	const sum = coll.reduce((a, x) => a + x, 0);
	expect(sum).toStrictEqual(6);
});

test('reduce collection into a single value without initial value', () => {
	const coll: TestCollection = new Collection();
	coll.set('a', 1);
	coll.set('b', 2);
	coll.set('c', 3);
	const sum = coll.reduce((a, x) => a + x, 0);
	expect(sum).toStrictEqual(6);
});

test('reduce empty collection without initial value', () => {
	const coll: TestCollection = new Collection();
	expect(() => coll.reduce((a: number, x) => a + x)).toThrowError(
		new TypeError('Reduce of empty collection with no initial value'),
	);
});

test('iterate over each item', () => {
	const coll: TestCollection = new Collection();
	coll.set('a', 1);
	coll.set('b', 2);
	coll.set('c', 3);
	const a: [string, number][] = [];
	coll.each((v, k) => a.push([k, v]));
	expect(a).toStrictEqual([
		['a', 1],
		['b', 2],
		['c', 3],
	]);
});

test('tap the collection', () => {
	const coll = new Collection();
	coll.set('a', 1);
	coll.set('b', 2);
	coll.set('c', 3);
	coll.tap((c) => expect(c).toStrictEqual(coll));
});

test('shallow clone the collection', () => {
	const coll = new Collection();
	coll.set('a', 1);
	coll.set('b', 2);
	coll.set('c', 3);
	const clone = coll.clone();
	expect([...coll.values()]).toStrictEqual([...clone.values()]);
});

test('merge multiple collections', () => {
	const coll1 = new Collection();
	coll1.set('a', 1);
	const coll2 = new Collection();
	coll2.set('b', 2);
	const coll3 = new Collection();
	coll3.set('c', 3);
	const merged = coll1.concat(coll2, coll3);
	expect([...merged.values()]).toStrictEqual([1, 2, 3]);
	expect(coll1 !== merged).toBeTruthy();
});

test('check equality of two collections', () => {
	const coll1 = new Collection<string, number>();
	coll1.set('a', 1);
	const coll2 = new Collection<string, number>();
	coll2.set('a', 1);
	expect(coll1.equals(coll2)).toBeTruthy();
	coll2.set('b', 2);
	expect(!coll1.equals(coll2)).toBeTruthy();
	coll2.clear();
	expect(!coll1.equals(coll2)).toBeTruthy();
});

test('sort a collection in place', () => {
	const coll: TestCollection = new Collection();
	coll.set('a', 3);
	coll.set('b', 2);
	coll.set('c', 1);
	expect([...coll.values()]).toStrictEqual([3, 2, 1]);
	coll.sort((a, b) => a - b);
	expect([...coll.values()]).toStrictEqual([1, 2, 3]);
});

test('random select from a collection', () => {
	const coll: TestCollection = new Collection();
	const chars = 'abcdefghijklmnopqrstuvwxyz';
	const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26];

	for (let i = 0; i < chars.length; i++) coll.set(chars[i]!, numbers[i]!);

	const random = coll.random(5);
	expect(random.length === 5).toBeTruthy();

	const set = new Set(random);
	expect(set.size === random.length).toBeTruthy();
});

test('when random param > collection size', () => {
	const coll = new Collection();
	coll.set('a', 3);
	coll.set('b', 2);
	coll.set('c', 1);

	const random = coll.random(5);
	expect(random.length).toEqual(coll.size);
});

test('sort a collection', () => {
	const coll: TestCollection = new Collection();
	coll.set('a', 3);
	coll.set('b', 2);
	coll.set('c', 1);
	expect([...coll.values()]).toStrictEqual([3, 2, 1]);
	const sorted = coll.sorted((a, b) => a - b);
	expect([...coll.values()]).toStrictEqual([3, 2, 1]);
	expect([...sorted.values()]).toStrictEqual([1, 2, 3]);
});

describe('at() tests', () => {
	const coll: TestCollection = new Collection();
	coll.set('a', 1);
	coll.set('b', 2);

	test('Positive index', () => {
		expect(coll.at(0)).toStrictEqual(1);
	});

	test('Negative index', () => {
		expect(coll.at(-1)).toStrictEqual(2);
	});

	test('Invalid positive index', () => {
		expect(coll.at(3)).toBeUndefined();
	});

	test('Invalid negative index', () => {
		expect(coll.at(-3)).toBeUndefined();
	});
});

describe('keyAt() tests', () => {
	const coll: TestCollection = new Collection();
	coll.set('a', 1);
	coll.set('b', 2);

	test('Positive index', () => {
		expect(coll.keyAt(0)).toStrictEqual('a');
	});

	test('Negative index', () => {
		expect(coll.keyAt(-1)).toStrictEqual('b');
	});

	test('Invalid positive index', () => {
		expect(coll.keyAt(3)).toBeUndefined();
	});

	test('Invalid negative index', () => {
		expect(coll.keyAt(-3)).toBeUndefined();
	});
});

describe('hasAll() tests', () => {
	const coll: TestCollection = new Collection();
	coll.set('a', 1);
	coll.set('b', 2);

	test('All keys exist in the collection', () => {
		expect(coll.hasAll('a', 'b')).toBeTruthy();
	});

	test('Some keys exist in the collection', () => {
		expect(coll.hasAll('b', 'c')).toBeFalsy();
	});

	test('No keys exist in the collection', () => {
		expect(coll.hasAll('c', 'd')).toBeFalsy();
	});
});

describe('hasAny() tests', () => {
	const coll: TestCollection = new Collection();
	coll.set('a', 1);
	coll.set('b', 2);

	test('All keys exist in the collection', () => {
		expect(coll.hasAny('a', 'b')).toBeTruthy();
	});

	test('Some keys exist in the collection', () => {
		expect(coll.hasAny('b', 'c')).toBeTruthy();
	});

	test('No keys exist in the collection', () => {
		expect(coll.hasAny('c', 'd')).toBeFalsy();
	});
});

test('reverse() tests', () => {
	const coll = new Collection();
	coll.set('a', 1);
	coll.set('b', 2);
	coll.set('c', 3);

	coll.reverse();

	expect([...coll.values()]).toStrictEqual([3, 2, 1]);
	expect([...coll.keys()]).toStrictEqual(['c', 'b', 'a']);
});

describe('random thisArg tests', () => {
	const coll = new Collection();
	coll.set('a', 3);
	coll.set('b', 2);
	coll.set('c', 1);

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

describe('ensure() tests', () => {
	function createTestCollection() {
		return new Collection([
			['a', 1],
			['b', 2],
		]);
	}

	test('set new value if key does not exist', () => {
		const coll = createTestCollection();
		coll.ensure('c', () => 3);
		expect(coll.size).toStrictEqual(3);
		expect(coll.get('c')).toStrictEqual(3);
	});

	test('return existing value if key exists', () => {
		const coll = createTestCollection();
		const ensureB = coll.ensure('b', () => 3);
		const getB = coll.get('b');
		expect(ensureB).toStrictEqual(2);
		expect(getB).toStrictEqual(2);
		expect(coll.size).toStrictEqual(2);
	});
});

describe('merge() tests', () => {
	const cL = new Collection([
		['L', 1],
		['LR', 2],
	]);
	const cR = new Collection([
		['R', 3],
		['LR', 4],
	]);

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
