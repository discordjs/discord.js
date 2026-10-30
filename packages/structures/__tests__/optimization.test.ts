import { describe, expect, test } from 'vitest';
import { dateToDiscordISOTimestamp } from '../src/utils/optimization.js';

describe('dateToDiscordISOTimestamp', () => {
	test('zero-pads milliseconds below 100', () => {
		// 5ms is .005000, not .500000
		expect(dateToDiscordISOTimestamp(new Date(Date.UTC(2_024, 0, 1, 0, 0, 0, 5)))).toBe(
			'2024-01-01T00:00:00.005000+00:00',
		);
		expect(dateToDiscordISOTimestamp(new Date(Date.UTC(2_024, 0, 1, 0, 0, 0, 42)))).toBe(
			'2024-01-01T00:00:00.042000+00:00',
		);
		expect(dateToDiscordISOTimestamp(new Date(Date.UTC(2_024, 0, 1, 0, 0, 0, 0)))).toBe(
			'2024-01-01T00:00:00.000000+00:00',
		);
	});

	test('round-trips every millisecond value', () => {
		for (const ms of [0, 1, 9, 10, 50, 99, 100, 500, 999]) {
			const date = new Date(Date.UTC(2_024, 5, 15, 12, 30, 45, ms));
			expect(new Date(dateToDiscordISOTimestamp(date)).getTime()).toBe(date.getTime());
		}
	});
});
