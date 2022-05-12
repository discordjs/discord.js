import type { RequestInit } from 'node-fetch';
import type { HandlerRequestData, RouteData } from '../RequestManager';
export interface IHandler {
    queueRequest: (routeId: RouteData, url: string, options: RequestInit, requestData: HandlerRequestData) => Promise<unknown>;
    get inactive(): boolean;
    readonly id: string;
}
