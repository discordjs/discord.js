import { describe, expect, test } from 'vitest';
import { embedLength } from '../src/functions/embedLength.js';

describe('embedLength', () => {
	test('GIVEN an embed with specific amount of characters THEN returns amount of characters', () => {
		const embed = {
			title: 'yeet',
			description: 'yeet',
			fields: [{ name: 'yeet', value: 'yeet' }],
			author: { name: 'yeet' },
			footer: { text: 'yeet' },
		};

		expect(embedLength(embed)).toEqual('yeet'.length * 6);
	});

	test('GIVEN an embed with zero characters THEN returns amount of characters', () => {
		expect(embedLength({})).toEqual(0);
	});
});
