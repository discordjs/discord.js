export function createDeferredPromise<T = unknown>() {
	let resolve!: (value: PromiseLike<T> | T) => void;
	let reject!: (reason?: unknown) => void;

	// eslint-disable-next-line promise/param-names
	const promise = new Promise<T>((res, rej) => {
		resolve = res;
		reject = rej;
	});

	return { promise, resolve, reject };
}

export interface DeferredPromise<T = unknown> {
	promise: Promise<T>;
	reject(reason?: unknown): void;
	resolve(value: PromiseLike<T> | T): void;
}
