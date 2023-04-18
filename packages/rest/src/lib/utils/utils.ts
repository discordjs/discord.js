import { URLSearchParams } from 'node:url';
import type { RESTPatchAPIChannelJSONBody } from 'discord-api-types/v10';
import type { RateLimitData, ResponseLike } from '../REST.js';
import { type RequestManager, RequestMethod } from '../RequestManager.js';
import { RateLimitError } from '../errors/RateLimitError.js';

function serializeSearchParam(value: unknown): string | null {
	switch (typeof value) {
		case 'string':
			return value;
		case 'number':
		case 'bigint':
		case 'boolean':
			return value.toString();
		case 'object':
			if (value === null) return null;
			if (value instanceof Date) {
				return Number.isNaN(value.getTime()) ? null : value.toISOString();
			}

			// eslint-disable-next-line @typescript-eslint/no-base-to-string
			if (typeof value.toString === 'function' && value.toString !== Object.prototype.toString) return value.toString();
			return null;
		default:
			return null;
	}
}

/**
 * Creates and populates an URLSearchParams instance from an object, stripping
 * out null and undefined values, while also coercing non-strings to strings.
 *
 * @param options - The options to use
 * @returns A populated URLSearchParams instance
 */
export function makeURLSearchParams<T extends object>(options?: Readonly<T>) {
	const params = new URLSearchParams();
	if (!options) return params;

	for (const [key, value] of Object.entries(options)) {
		const serialized = serializeSearchParam(value);
		if (serialized !== null) params.append(key, serialized);
	}

	return params;
}

/**
 * Converts the response to usable data
 *
 * @param res - The fetch response
 */
export async function parseResponse(res: ResponseLike): Promise<unknown> {
	if (res.headers.get('Content-Type')?.startsWith('application/json')) {
		return res.json();
	}

	return res.arrayBuffer();
}

/**
 * Check whether a request falls under a sublimit
 *
 * @param bucketRoute - The buckets route identifier
 * @param body - The options provided as JSON data
 * @param method - The HTTP method that will be used to make the request
 * @returns Whether the request falls under a sublimit
 */
export function hasSublimit(bucketRoute: string, body?: unknown, method?: string): boolean {
	// TODO: Update for new sublimits
	// Currently known sublimits:
	// Editing channel `name` or `topic`
	if (bucketRoute === '/channels/:id') {
		if (typeof body !== 'object' || body === null) return false;
		// This should never be a POST body, but just in case
		if (method !== RequestMethod.Patch) return false;
		const castedBody = body as RESTPatchAPIChannelJSONBody;
		return ['name', 'topic'].some((key) => Reflect.has(castedBody, key));
	}

	// If we are checking if a request has a sublimit on a route not checked above, sublimit all requests to avoid a flood of 429s
	return true;
}

/**
 * Check whether an error indicates that a retry can be attempted
 *
 * @param error - The error thrown by the network request
 * @returns Whether the error indicates a retry should be attempted
 */
export function shouldRetry(error: Error | NodeJS.ErrnoException) {
	// Retry for possible timed out requests
	if (error.name === 'AbortError') return true;
	// Downlevel ECONNRESET to retry as it may be recoverable
	return ('code' in error && error.code === 'ECONNRESET') || error.message.includes('ECONNRESET');
}

/**
 * Determines whether the request should be queued or whether a RateLimitError should be thrown
 *
 * @internal
 */
export async function onRateLimit(manager: RequestManager, rateLimitData: RateLimitData) {
	const { options } = manager;
	if (!options.rejectOnRateLimit) return;

	const shouldThrow =
		typeof options.rejectOnRateLimit === 'function'
			? await options.rejectOnRateLimit(rateLimitData)
			: options.rejectOnRateLimit.some((route) => rateLimitData.route.startsWith(route.toLowerCase()));
	if (shouldThrow) {
		throw new RateLimitError(rateLimitData);
	}
}
