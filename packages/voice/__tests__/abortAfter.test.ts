import { abortAfter } from '../src/util/abortAfter.js';

jest.useFakeTimers();

const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

describe('abortAfter', () => {
	test('Aborts after the given delay', () => {
		const [ac, signal] = abortAfter(100);
		expect(ac.signal).toEqual(signal);
		expect(signal.aborted).toEqual(false);
		jest.runAllTimers();
		expect(signal.aborted).toEqual(true);
	});

	test('Cleans up when manually aborted', () => {
		const [ac, signal] = abortAfter(100);
		expect(ac.signal).toEqual(signal);
		expect(signal.aborted).toEqual(false);
		clearTimeoutSpy.mockClear();
		ac.abort();
		expect(clearTimeoutSpy).toHaveBeenCalledTimes(1);
	});
});
