import type { RequestInit } from 'node-fetch';
import type { InternalRequest, RouteData } from '../RequestManager';

export interface IHandler {
	queueRequest: (
		routeId: RouteData,
		url: string,
		options: RequestInit,
		requestData: Pick<InternalRequest, 'files' | 'body' | 'auth'>,
	) => Promise<unknown>;
	// eslint-disable-next-line @typescript-eslint/method-signature-style -- This is meant to be a getter returning a bool
	get inactive(): boolean;
	readonly id: string;
}
