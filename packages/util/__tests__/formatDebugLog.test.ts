import { describe, test, expect } from 'vitest';
import { formatDebugLog } from '../src/index.js';

describe('formatDebugLog', () => {
	test('GIVEN 1 message THEN returns singular message', () => {
		expect(formatDebugLog(['Hello, world!'])).toBe('Hello, world!');
	});

	test('GIVEN multiple messages THEN returns message with new lines', () => {
		expect(formatDebugLog(['Hello, world!', 'Hello again!'])).toBe('Hello, world!\n\tHello again!');
	});
});
