import type { Dispatcher } from 'undici';
import type { RequestOptions } from '../REST';
import type { HandlerRequestData, RouteData } from '../RequestManager';

export interface IHandler {
	/**
	 * Queues a request to be sent
	 *
	 * @param routeId - The generalized api route with literal ids for major parameters
	 * @param url - The url to do the request on
	 * @param options - All the information needed to make a request
	 * @param requestData - Extra data from the user's request needed for errors and additional processing
	 */
	queueRequest: (
		routeId: RouteData,
		url: string,
		options: RequestOptions,
		requestData: HandlerRequestData,
	) => Promise<Dispatcher.ResponseData>;
	/**
	 * If the bucket is currently inactive (no pending requests)
	 */
	// eslint-disable-next-line @typescript-eslint/method-signature-style -- This is meant to be a getter returning a bool
	get inactive(): boolean;
	/**
	 * The unique id of the handler
	 */
	readonly id: string;
}
