import type { RequestInit } from 'undici';
import type { REST } from '../REST.js';
import type { DiscordErrorData, OAuthErrorData } from '../errors/DiscordAPIError.js';
import { DiscordAPIError } from '../errors/DiscordAPIError.js';
import { HTTPError } from '../errors/HTTPError.js';
import { RESTEvents } from '../utils/constants.js';
import type { ResponseLike, HandlerRequestData, RouteData } from '../utils/types.js';
import { normalizeRetryBackoff, normalizeTimeout, parseResponse, shouldRetry, sleep } from '../utils/utils.js';

let authFalseWarningEmitted = false;

/**
 * Invalid request limiting is done on a per-IP basis, not a per-token basis.
 * The best we can do is track invalid counts process-wide (on the theory that
 * users could have multiple bots run from one process) rather than per-bot.
 * Therefore, store these at file scope here rather than in the client's
 * RESTManager object.
 */
let invalidCount = 0;
let invalidCountResetTime: number | null = null;

/**
 * Increment the invalid request count and emit warning if necessary
 *
 * @internal
 */
export function incrementInvalidCount(manager: REST) {
	if (!invalidCountResetTime || invalidCountResetTime < Date.now()) {
		invalidCountResetTime = Date.now() + 1_000 * 60 * 10;
		invalidCount = 0;
	}

	invalidCount++;

	const emitInvalid =
		manager.options.invalidRequestWarningInterval > 0 &&
		invalidCount % manager.options.invalidRequestWarningInterval === 0;
	if (emitInvalid) {
		// Let library users know periodically about invalid requests
		manager.emit(RESTEvents.InvalidRequestWarning, {
			count: invalidCount,
			remainingTime: invalidCountResetTime - Date.now(),
		});
	}
}

/**
 * Performs the actual network request for a request handler
 *
 * @param manager - The manager that holds options and emits informational events
 * @param routeId - The generalized api route with literal ids for major parameters
 * @param url - The fully resolved url to make the request to
 * @param options - The fetch options needed to make the request
 * @param requestData - Extra data from the user's request needed for errors and additional processing
 * @param retries - The number of retries this request has already attempted (recursion occurs on the handler)
 * @returns The respond from the network or `null` when the request should be retried
 * @internal
 */
export async function makeNetworkRequest(
	manager: REST,
	routeId: RouteData,
	url: string,
	options: RequestInit,
	requestData: HandlerRequestData,
	retries: number,
) {
	const controller = new AbortController();
	const timeout = setTimeout(
		() => controller.abort(),
		normalizeTimeout(manager.options.timeout, routeId.bucketRoute, requestData.body),
	);
	if (requestData.signal) {
		// If the user signal was aborted, abort the controller, else abort the local signal.
		// The reason why we don't re-use the user's signal, is because users may use the same signal for multiple
		// requests, and we do not want to cause unexpected side-effects.
		if (requestData.signal.aborted) controller.abort();
		else requestData.signal.addEventListener('abort', () => controller.abort());
	}

	let res: ResponseLike;
	try {
		res = await manager.options.makeRequest(url, { ...options, signal: controller.signal });
	} catch (error: unknown) {
		if (!(error instanceof Error)) throw error;
		// Retry the specified number of times if needed
		if (shouldRetry(error) && retries !== manager.options.retries) {
			const backoff = normalizeRetryBackoff(
				manager.options.retryBackoff,
				routeId.bucketRoute,
				null,
				retries,
				requestData.body,
			);
			if (backoff === null) {
				throw error;
			}

			if (backoff > 0) {
				await sleep(backoff);
			}

			// Retry is handled by the handler upon receiving null
			return null;
		}

		throw error;
	} finally {
		clearTimeout(timeout);
	}

	if (manager.listenerCount(RESTEvents.Response)) {
		manager.emit(
			RESTEvents.Response,
			{
				method: options.method ?? 'get',
				path: routeId.original,
				route: routeId.bucketRoute,
				options,
				data: requestData,
				retries,
			},
			res instanceof Response ? res.clone() : { ...res },
		);
	}

	return res;
}

/**
 * Handles 5xx and 4xx errors (not 429's) conventionally. 429's should be handled before calling this function
 *
 * @param manager - The manager that holds options and emits informational events
 * @param res - The response received from {@link makeNetworkRequest}
 * @param method - The method used to make the request
 * @param url - The fully resolved url to make the request to
 * @param requestData - Extra data from the user's request needed for errors and additional processing
 * @param retries - The number of retries this request has already attempted (recursion occurs on the handler)
 * @param routeId - The generalized API route with literal ids for major parameters
 * @returns The response if the status code is not handled or null to request a retry
 */
export async function handleErrors(
	manager: REST,
	res: ResponseLike,
	method: string,
	url: string,
	requestData: HandlerRequestData,
	retries: number,
	routeId: RouteData,
) {
	const status = res.status;
	if (status >= 500 && status < 600) {
		// Retry the specified number of times for possible server side issues
		if (retries !== manager.options.retries) {
			const backoff = normalizeRetryBackoff(
				manager.options.retryBackoff,
				routeId.bucketRoute,
				status,
				retries,
				requestData.body,
			);
			if (backoff === null) {
				throw new HTTPError(status, res.statusText, method, url, requestData);
			}

			if (backoff > 0) {
				await sleep(backoff);
			}

			return null;
		}

		// We are out of retries, throw an error
		throw new HTTPError(status, res.statusText, method, url, requestData);
	} else {
		// Handle possible malformed requests
		if (status >= 400 && status < 500) {
			// The request will not succeed for some reason, parse the error returned from the api
			const data = (await parseResponse(res)) as DiscordErrorData | OAuthErrorData;
			const isDiscordError = 'code' in data;

			// If we receive this status code, it means the token we had is no longer valid.
			if (status === 401 && requestData.auth === true) {
				if (isDiscordError && data.code !== 0 && !authFalseWarningEmitted) {
					const errorText = `Encountered HTTP 401 with error ${data.code}: ${data.message}. Your token will be removed from this REST instance. If you are using @discordjs/rest directly, consider adding 'auth: false' to the request. Open an issue with your library if not.`;
					// Use emitWarning if possible, probably not available in edge / web
					if (typeof globalThis.process !== 'undefined' && typeof globalThis.process.emitWarning === 'function') {
						globalThis.process.emitWarning(errorText);
					} else {
						console.warn(errorText);
					}

					authFalseWarningEmitted = true;
				}

				manager.setToken(null!);
			}

			// throw the API error
			throw new DiscordAPIError(data, isDiscordError ? data.code : data.error, status, method, url, requestData);
		}

		return res;
	}
}
