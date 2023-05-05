import type { Dispatcher } from 'undici';
import type { RequestOptions } from '../REST.js';
import type { HandlerRequestData, RouteData } from '../RequestManager.js';

export interface IHandler {
	/**
	 * The unique id of the handler
	 */
	readonly id: string;
	/**
	 * If the bucket is currently inactive (no pending requests)
	 */
	get inactive(): boolean;
	/**
	 * Queues a request to be sent
	 *
	 * @param routeId - The generalized api route with literal ids for major parameters
	 * @param url - The url to do the request on
	 * @param options - All the information needed to make a request
	 * @param requestData - Extra data from the user's request needed for errors and additional processing
	 */
	queueRequest(
		routeId: RouteData,
		url: string,
		options: RequestOptions,
		requestData: HandlerRequestData,
	): Promise<Dispatcher.ResponseData>;
}

export interface PolyFillAbortSignal {
	readonly aborted: boolean;
	addEventListener(type: 'abort', listener: () => void): void;
	removeEventListener(type: 'abort', listener: () => void): void;
}
