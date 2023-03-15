import { setTimeout, clearTimeout } from 'node:timers';
import { setTimeout as sleep } from 'node:timers/promises';
import { request, type Dispatcher } from 'undici';
import type { RequestOptions } from '../REST.js';
import type { HandlerRequestData, RequestManager, RouteData } from '../RequestManager.js';
import { DiscordAPIError, type DiscordErrorData, type OAuthErrorData } from '../errors/DiscordAPIError.js';
import { HTTPError } from '../errors/HTTPError.js';
import { RESTEvents } from '../utils/constants.js';
import { onRateLimit, parseHeader, parseResponse, shouldRetry } from '../utils/utils.js';
import type { IHandler, PolyFillAbortSignal } from './IHandler.js';

/**
 * The structure used to handle burst requests for a given bucket.
 * Burst requests have no ratelimit handling but allow for pre- and post-processing
 * of data in the same manner as sequentially queued requests.
 *
 * @remarks
 * This queue may still emit a rate limit error if an unexpected 429 is hit</info>
 */
export class BurstHandler implements IHandler {
	/**
	 * {@inheritdoc IHandler.id}
	 */
	public readonly id: string;

	/**
	 * {@inheritDoc IHandler.inactive}
	 */
	public inactive = false;

	/**
	 * @param manager - The request manager
	 * @param hash - The hash that this RequestHandler handles
	 * @param majorParameter - The major parameter for this handler
	 */
	public constructor(
		private readonly manager: RequestManager,
		private readonly hash: string,
		private readonly majorParameter: string,
	) {
		this.id = `${hash}:${majorParameter}`;
	}

	/**
	 * Emits a debug message
	 *
	 * @param message - The message to debug
	 */
	private debug(message: string) {
		this.manager.emit(RESTEvents.Debug, `[REST ${this.id}] ${message}`);
	}

	/**
	 * {@inheritDoc IHandler.queueRequest}
	 */
	public async queueRequest(
		routeId: RouteData,
		url: string,
		options: Omit<Dispatcher.RequestOptions, 'method' | 'origin' | 'path'> &
			Partial<Pick<Dispatcher.RequestOptions, 'method'>> & { dispatcher?: Dispatcher },
		requestData: HandlerRequestData,
	): Promise<Dispatcher.ResponseData> {
		return this.runRequest(routeId, url, options, requestData);
	}

	/**
	 * The method that actually makes the request to the api, and updates info about the bucket accordingly
	 *
	 * @param routeId - The generalized api route with literal ids for major parameters
	 * @param url - The fully resolved url to make the request to
	 * @param options - The fetch options needed to make the request
	 * @param requestData - Extra data from the user's request needed for errors and additional processing
	 * @param retries - The number of retries this request has already attempted (recursion)
	 */
	private async runRequest(
		routeId: RouteData,
		url: string,
		options: RequestOptions,
		requestData: HandlerRequestData,
		retries = 0,
	): Promise<Dispatcher.ResponseData> {
		const method = options.method ?? 'get';

		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), this.manager.options.timeout).unref();
		if (requestData.signal) {
			// The type polyfill is required because Node.js's types are incomplete.
			const signal = requestData.signal as PolyFillAbortSignal;
			// If the user signal was aborted, abort the controller, else abort the local signal.
			// The reason why we don't re-use the user's signal, is because users may use the same signal for multiple
			// requests, and we do not want to cause unexpected side-effects.
			if (signal.aborted) controller.abort();
			else signal.addEventListener('abort', () => controller.abort());
		}

		let res: Dispatcher.ResponseData;
		try {
			res = await request(url, { ...options, signal: controller.signal });
		} catch (error: unknown) {
			if (!(error instanceof Error)) throw error;
			// Retry the specified number of times if needed
			if (shouldRetry(error) && retries !== this.manager.options.retries) {
				// eslint-disable-next-line no-param-reassign
				return await this.runRequest(routeId, url, options, requestData, ++retries);
			}

			throw error;
		} finally {
			clearTimeout(timeout);
		}

		const status = res.statusCode;
		let retryAfter = 0;
		const retry = parseHeader(res.headers['retry-after']);

		// Amount of time in milliseconds until we should retry if rate limited (globally or otherwise)
		if (retry) retryAfter = Number(retry) * 1_000 + this.manager.options.offset;

		// Count the invalid requests
		if (status === 401 || status === 403 || status === 429) {
			this.manager.incrementInvalidCount();
		}

		if (status >= 200 && status < 300) {
			return res;
		} else if (status === 429) {
			// Unexpected ratelimit
			const isGlobal = res.headers['x-ratelimit-global'] !== undefined;
			await onRateLimit(this.manager, {
				timeToReset: retryAfter,
				limit: Number.POSITIVE_INFINITY,
				method,
				hash: this.hash,
				url,
				route: routeId.bucketRoute,
				majorParameter: this.majorParameter,
				global: isGlobal,
			});
			this.debug(
				[
					'Encountered unexpected 429 rate limit',
					`  Global         : ${isGlobal}`,
					`  Method         : ${method}`,
					`  URL            : ${url}`,
					`  Bucket         : ${routeId.bucketRoute}`,
					`  Major parameter: ${routeId.majorParameter}`,
					`  Hash           : ${this.hash}`,
					`  Limit          : ${Number.POSITIVE_INFINITY}`,
					`  Retry After    : ${retryAfter}ms`,
					`  Sublimit       : None`,
				].join('\n'),
			);

			// We are bypassing all other limits, but an encountered limit should be respected (it's probably a non-punished ratelimit anyways)
			await sleep(retryAfter);

			// Since this is not a server side issue, the next request should pass, so we don't bump the retries counter
			return this.runRequest(routeId, url, options, requestData, retries);
		} else if (status >= 500 && status < 600) {
			// Retry the specified number of times for possible server side issues
			if (retries !== this.manager.options.retries) {
				// eslint-disable-next-line no-param-reassign
				return this.runRequest(routeId, url, options, requestData, ++retries);
			}

			// We are out of retries, throw an error
			throw new HTTPError(status, method, url, requestData);
		} else {
			// Handle possible malformed requests
			if (status >= 400 && status < 500) {
				// If we receive this status code, it means the token we had is no longer valid.
				if (status === 401 && requestData.auth) {
					this.manager.setToken(null!);
				}

				// The request will not succeed for some reason, parse the error returned from the api
				const data = (await parseResponse(res)) as DiscordErrorData | OAuthErrorData;
				// throw the API error
				throw new DiscordAPIError(data, 'code' in data ? data.code : data.error, status, method, url, requestData);
			}

			return res;
		}
	}
}
