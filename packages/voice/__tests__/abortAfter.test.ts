import { abortAfter } from '../src/util/abortAfter';

jest.useFakeTimers();

const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

describe('abortAfter', () => {
	test('Aborts after the given delay', () => {
		const [ac, signal] = abortAfter(100);
		expect(ac.signal).toBe(signal);
		expect(signal.aborted).toBe(false);
		jest.runAllTimers();
		expect(signal.aborted).toBe(true);
	});

	test('Cleans up when manually aborted', () => {
		const [ac, signal] = abortAfter(100);
		expect(ac.signal).toBe(signal);
		expect(signal.aborted).toBe(false);
		clearTimeoutSpy.mockClear();
		ac.abort();
		expect(clearTimeoutSpy).toHaveBeenCalledTimes(1);
	});
});
