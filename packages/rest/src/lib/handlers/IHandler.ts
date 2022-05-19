import type { Dispatcher } from 'undici';
import type { RequestOptions } from '../REST';
import type { HandlerRequestData, RouteData } from '../RequestManager';

export interface IHandler {
	queueRequest: (
		routeId: RouteData,
		url: string,
		options: RequestOptions,
		requestData: HandlerRequestData,
	) => Promise<Dispatcher.ResponseData>;
	// eslint-disable-next-line @typescript-eslint/method-signature-style -- This is meant to be a getter returning a bool
	get inactive(): boolean;
	readonly id: string;
}
