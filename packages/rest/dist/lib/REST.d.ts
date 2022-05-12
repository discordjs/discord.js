/// <reference types="node" />
import { EventEmitter } from 'node:events';
import type { AgentOptions } from 'node:https';
import type Collection from '@discordjs/collection';
import type { RequestInit, Response } from 'node-fetch';
import { CDN } from './CDN';
import { HandlerRequestData, InternalRequest, RequestData, RequestManager, RouteLike } from './RequestManager';
import type { HashData } from './RequestManager';
import type { IHandler } from './handlers/IHandler';
/**
 * Options to be passed when creating the REST instance
 */
export interface RESTOptions {
    /**
     * HTTPS Agent options
     * @default {}
     */
    agent: Omit<AgentOptions, 'keepAlive'>;
    /**
     * The base api path, without version
     * @default 'https://discord.com/api'
     */
    api: string;
    /**
     * The authorization prefix to use for requests, useful if you want to use
     * bearer tokens
     * @default 'Bot'
     */
    authPrefix: 'Bot' | 'Bearer';
    /**
     * The cdn path
     * @default 'https://cdn.discordapp.com'
     */
    cdn: string;
    /**
     * Additional headers to send for all API requests
     * @default {}
     */
    headers: Record<string, string>;
    /**
     * The number of invalid REST requests (those that return 401, 403, or 429) in a 10 minute window between emitted warnings (0 for no warnings).
     * That is, if set to 500, warnings will be emitted at invalid request number 500, 1000, 1500, and so on.
     * @default 0
     */
    invalidRequestWarningInterval: number;
    /**
     * How many requests to allow sending per second (Infinity for unlimited, 50 for the standard global limit used by Discord)
     * @default 50
     */
    globalRequestsPerSecond: number;
    /**
     * The extra offset to add to rate limits in milliseconds
     * @default 50
     */
    offset: number;
    /**
     * Determines how rate limiting and pre-emptive throttling should be handled.
     * When an array of strings, each element is treated as a prefix for the request route
     * (e.g. `/channels` to match any route starting with `/channels` such as `/channels/:id/messages`)
     * for which to throw {@link RateLimitError}s. All other request routes will be queued normally
     * @default null
     */
    rejectOnRateLimit: string[] | RateLimitQueueFilter | null;
    /**
     * The number of retries for errors with the 500 code, or errors
     * that timeout
     * @default 3
     */
    retries: number;
    /**
     * The time to wait in milliseconds before a request is aborted
     * @default 15_000
     */
    timeout: number;
    /**
     * Extra information to add to the user agent
     * @default `Node.js ${process.version}`
     */
    userAgentAppendix: string;
    /**
     * The version of the API to use
     * @default '10'
     */
    version: string;
    /**
     * The amount of time in milliseconds that passes between each hash sweep. (defaults to 4h)
     * @default 14_400_000
     */
    hashSweepInterval: number;
    /**
     * The maximum amount of time a hash can exist in milliseconds without being hit with a request (defaults to 24h)
     * @default 86_400_000
     */
    hashLifetime: number;
    /**
     * The amount of time in milliseconds that passes between each hash sweep. (defaults to 1h)
     * @default 3_600_000
     */
    handlerSweepInterval: number;
}
/**
 * Data emitted on `RESTEvents.RateLimited`
 */
export interface RateLimitData {
    /**
     * The time, in milliseconds, until the request-lock is reset
     */
    timeToReset: number;
    /**
     * The amount of requests we can perform before locking requests
     */
    limit: number;
    /**
     * The HTTP method being performed
     */
    method: string;
    /**
     * The bucket hash for this request
     */
    hash: string;
    /**
     * The full URL for this request
     */
    url: string;
    /**
     * The route being hit in this request
     */
    route: string;
    /**
     * The major parameter of the route
     *
     * For example, in `/channels/x`, this will be `x`.
     * If there is no major parameter (e.g: `/bot/gateway`) this will be `global`.
     */
    majorParameter: string;
    /**
     * Whether the rate limit that was reached was the global limit
     */
    global: boolean;
}
/**
 * A function that determines whether the rate limit hit should throw an Error
 */
export declare type RateLimitQueueFilter = (rateLimitData: RateLimitData) => boolean | Promise<boolean>;
export interface APIRequest {
    /**
     * The HTTP method used in this request
     */
    method: string;
    /**
     * The full path used to make the request
     */
    path: RouteLike;
    /**
     * The API route identifying the ratelimit for this request
     */
    route: string;
    /**
     * Additional HTTP options for this request
     */
    options: RequestInit;
    /**
     * The data that was used to form the body of this request
     */
    data: HandlerRequestData;
    /**
     * The number of times this request has been attempted
     */
    retries: number;
}
export interface InvalidRequestWarningData {
    /**
     * Number of invalid requests that have been made in the window
     */
    count: number;
    /**
     * Time in milliseconds remaining before the count resets
     */
    remainingTime: number;
}
export interface RestEvents {
    invalidRequestWarning: [invalidRequestInfo: InvalidRequestWarningData];
    restDebug: [info: string];
    rateLimited: [rateLimitInfo: RateLimitData];
    request: [request: APIRequest];
    response: [request: APIRequest, response: Response];
    newListener: [name: string, listener: (...args: any) => void];
    removeListener: [name: string, listener: (...args: any) => void];
    hashSweep: [sweptHashes: Collection<string, HashData>];
    handlerSweep: [sweptHandlers: Collection<string, IHandler>];
}
export interface REST {
    on: (<K extends keyof RestEvents>(event: K, listener: (...args: RestEvents[K]) => void) => this) & (<S extends string | symbol>(event: Exclude<S, keyof RestEvents>, listener: (...args: any[]) => void) => this);
    once: (<K extends keyof RestEvents>(event: K, listener: (...args: RestEvents[K]) => void) => this) & (<S extends string | symbol>(event: Exclude<S, keyof RestEvents>, listener: (...args: any[]) => void) => this);
    emit: (<K extends keyof RestEvents>(event: K, ...args: RestEvents[K]) => boolean) & (<S extends string | symbol>(event: Exclude<S, keyof RestEvents>, ...args: any[]) => boolean);
    off: (<K extends keyof RestEvents>(event: K, listener: (...args: RestEvents[K]) => void) => this) & (<S extends string | symbol>(event: Exclude<S, keyof RestEvents>, listener: (...args: any[]) => void) => this);
    removeAllListeners: (<K extends keyof RestEvents>(event?: K) => this) & (<S extends string | symbol>(event?: Exclude<S, keyof RestEvents>) => this);
}
export declare class REST extends EventEmitter {
    readonly cdn: CDN;
    readonly requestManager: RequestManager;
    constructor(options?: Partial<RESTOptions>);
    /**
     * Sets the authorization token that should be used for requests
     * @param token The authorization token to use
     */
    setToken(token: string): this;
    /**
     * Runs a get request from the api
     * @param fullRoute The full route to query
     * @param options Optional request options
     */
    get(fullRoute: RouteLike, options?: RequestData): Promise<unknown>;
    /**
     * Runs a delete request from the api
     * @param fullRoute The full route to query
     * @param options Optional request options
     */
    delete(fullRoute: RouteLike, options?: RequestData): Promise<unknown>;
    /**
     * Runs a post request from the api
     * @param fullRoute The full route to query
     * @param options Optional request options
     */
    post(fullRoute: RouteLike, options?: RequestData): Promise<unknown>;
    /**
     * Runs a put request from the api
     * @param fullRoute The full route to query
     * @param options Optional request options
     */
    put(fullRoute: RouteLike, options?: RequestData): Promise<unknown>;
    /**
     * Runs a patch request from the api
     * @param fullRoute The full route to query
     * @param options Optional request options
     */
    patch(fullRoute: RouteLike, options?: RequestData): Promise<unknown>;
    /**
     * Runs a request from the api
     * @param options Request options
     */
    request(options: InternalRequest): Promise<unknown>;
}
