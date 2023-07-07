import { setTimeout as sleep } from 'node:timers/promises';
import type { RequestInit } from 'undici';
import type { ResponseLike } from '../REST.js';
import type { HandlerRequestData, RequestManager, RouteData } from '../RequestManager.js';
import type { IHandler } from '../interfaces/Handler.js';
import { RESTEvents } from '../utils/constants.js';
import { onRateLimit } from '../utils/utils.js';
import { handleErrors, incrementInvalidCount, makeNetworkRequest } from './Shared.js';

/**
 * The structure used to handle burst requests for a given bucket.
 * Burst requests have no ratelimit handling but allow for pre- and post-processing
 * of data in the same manner as sequentially queued requests.
 *
 * @remarks
 * This queue may still emit a rate limit error if an unexpected 429 is hit
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
		options: RequestInit,
		requestData: HandlerRequestData,
	): Promise<ResponseLike> {
		return this.runRequest(routeId, url, options, requestData);
	}

	/**
	 * The method that actually makes the request to the API, and updates info about the bucket accordingly
	 *
	 * @param routeId - The generalized API route with literal ids for major parameters
	 * @param url - The fully resolved URL to make the request to
	 * @param options - The fetch options needed to make the request
	 * @param requestData - Extra data from the user's request needed for errors and additional processing
	 * @param retries - The number of retries this request has already attempted (recursion)
	 */
	private async runRequest(
		routeId: RouteData,
		url: string,
		options: RequestInit,
		requestData: HandlerRequestData,
		retries = 0,
	): Promise<ResponseLike> {
		const method = options.method ?? 'get';

		const res = await makeNetworkRequest(this.manager, routeId, url, options, requestData, retries);

		// Retry requested
		if (res === null) {
			// eslint-disable-next-line no-param-reassign
			return this.runRequest(routeId, url, options, requestData, ++retries);
		}

		const status = res.status;
		let retryAfter = 0;
		const retry = res.headers.get('Retry-After');

		// Amount of time in milliseconds until we should retry if rate limited (globally or otherwise)
		if (retry) retryAfter = Number(retry) * 1_000 + this.manager.options.offset;

		// Count the invalid requests
		if (status === 401 || status === 403 || status === 429) {
			incrementInvalidCount(this.manager);
		}

		if (status >= 200 && status < 300) {
			return res;
		} else if (status === 429) {
			// Unexpected ratelimit
			const isGlobal = res.headers.has('X-RateLimit-Global');
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

			// We are bypassing all other limits, but an encountered limit should be respected (it's probably a non-punished rate limit anyways)
			await sleep(retryAfter);

			// Since this is not a server side issue, the next request should pass, so we don't bump the retries counter
			return this.runRequest(routeId, url, options, requestData, retries);
		} else {
			const handled = await handleErrors(this.manager, res, method, url, requestData, retries);
			if (handled === null) {
				// eslint-disable-next-line no-param-reassign
				return this.runRequest(routeId, url, options, requestData, ++retries);
			}

			return handled;
		}
	}
}
