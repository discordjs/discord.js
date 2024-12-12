import { describe, test, expect } from 'vitest';
import { groupBy } from '../src/index.js';

describe('groupBy', () => {
	test('GIVEN an array of objects and a key THEN groups the objects by the key', () => {
		const objects = [
			{ name: 'Alice', age: 20 },
			{ name: 'Bob', age: 20 },
			{ name: 'Charlie', age: 30 },
		];

		const grouped = groupBy(objects, (object) => object.age);

		expect(grouped).toEqual(
			new Map([
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
