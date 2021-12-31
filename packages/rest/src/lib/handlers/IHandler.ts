import type { RequestInit } from 'node-fetch';
import type { InternalRequest, RouteData } from '../RequestManager';

export interface IHandler {
	queueRequest(
		routeId: RouteData,
		url: string,
		options: RequestInit,
		bodyData: Pick<InternalRequest, 'attachments' | 'body'>,
	): Promise<unknown>;
}
