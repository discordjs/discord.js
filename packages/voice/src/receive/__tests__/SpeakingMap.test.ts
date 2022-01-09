import { noop } from '../../util/util';
import { SpeakingMap } from '../SpeakingMap';

jest.useFakeTimers();

describe('SpeakingMap', () => {
	test('Emits start and end', () => {
		const speaking = new SpeakingMap();
		const userId = '123';

		const starts: string[] = [];
		const ends: string[] = [];

		speaking.on('start', (userId) => void starts.push(userId));
		speaking.on('end', (userId) => void ends.push(userId));

		for (let i = 0; i < 10; i++) {
			speaking.onPacket(userId);
			setTimeout(noop, SpeakingMap.DELAY / 2);
			jest.advanceTimersToNextTimer();

			expect(starts).toEqual([userId]);
			expect(ends).toEqual([]);
		}
		jest.advanceTimersToNextTimer();
		expect(ends).toEqual([userId]);

		speaking.onPacket(userId);
		jest.advanceTimersToNextTimer();
		expect(starts).toEqual([userId, userId]);
	});
});
