import type { RequestInit } from 'undici';
import type { HandlerRequestData, RouteData, ResponseLike } from '../utils/types.js';

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
		options: RequestInit,
		requestData: HandlerRequestData,
	): Promise<ResponseLike>;
}
