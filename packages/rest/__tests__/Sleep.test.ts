import { afterEach, beforeEach, expect, test, vitest } from 'vitest';
import { sleep } from '../src/lib/utils/utils.js';

beforeEach(() => {
	vitest.useFakeTimers();
});

afterEach(() => {
	vitest.restoreAllMocks();
	vitest.useRealTimers();
});

test.each([undefined, { ref: true }, { ref: false }])('sleep respects the ref option %j', async (options) => {
	const setTimeout = vitest.spyOn(globalThis, 'setTimeout');
	const completed = vitest.fn();
	const sleeping = (async () => {
		await sleep(1_000, options);
		completed();
	})();

	expect(setTimeout.mock.results[0]?.value.hasRef()).toBe(options?.ref !== false);
	await vitest.advanceTimersByTimeAsync(999);
	expect(completed).not.toHaveBeenCalled();
	await vitest.advanceTimersByTimeAsync(1);
	await sleeping;
	expect(completed).toHaveBeenCalledOnce();
});

test('an unreferenced sleep supports numeric timer handles in edge environments', async () => {
	const setTimeout = globalThis.setTimeout;
	vitest.spyOn(globalThis, 'setTimeout').mockImplementation((callback, delay) => {
		setTimeout(callback, delay);
		return 1 as unknown as ReturnType<typeof setTimeout>;
	});
	const completed = vitest.fn();
	const sleeping = (async () => {
		await sleep(1_000, { ref: false });
		completed();
	})();

	await vitest.advanceTimersByTimeAsync(999);
	expect(completed).not.toHaveBeenCalled();
	await vitest.advanceTimersByTimeAsync(1);
	await sleeping;
	expect(completed).toHaveBeenCalledOnce();
});
