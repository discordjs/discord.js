/**
 * Creates an abort controller that aborts after the given time.
 *
 * @param delay - The time in milliseconds to wait before aborting
 */
export function abortAfter(delay: number): [AbortController, AbortSignal] {
	const ac = new AbortController();
	const timeout = setTimeout(() => ac.abort(), delay);
	// @ts-expect-error no type for timeout
	// eslint-disable-next-line @typescript-eslint/no-unsafe-call
	ac.signal.addEventListener('abort', () => clearTimeout(timeout));
	return [ac, ac.signal];
}
