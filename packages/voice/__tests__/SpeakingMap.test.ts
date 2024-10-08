import { describe, test, expect, vitest } from 'vitest';
import { SpeakingMap } from '../src/receive/SpeakingMap';
import { noop } from '../src/util/util';

vitest.useFakeTimers();

describe('SpeakingMap', () => {
	test('Emits start and end', () => {
		const speaking = new SpeakingMap();
		const userId = '123';

		const starts: string[] = [];
		const ends: string[] = [];

		speaking.on('start', (userId) => void starts.push(userId));
		speaking.on('end', (userId) => void ends.push(userId));

		for (let index = 0; index < 10; index++) {
			speaking.onPacket(userId);
			setTimeout(noop, SpeakingMap.DELAY / 2);
			vitest.advanceTimersToNextTimer();

			expect(starts).toEqual([userId]);
			expect(ends).toEqual([]);
		}

		vitest.advanceTimersToNextTimer();
		expect(ends).toEqual([userId]);

		speaking.onPacket(userId);
		vitest.advanceTimersToNextTimer();
		expect(starts).toEqual([userId, userId]);
	});
});
