import type { Readable } from 'node:stream';
import type { ReadableStream } from 'node:stream/web';
import type { Collection } from '@discordjs/collection';
import type { Awaitable } from '@discordjs/util';
import type { Agent, Dispatcher, RequestInit, BodyInit, Response } from 'undici';
import type { IHandler } from '../interfaces/Handler.js';

export interface RestEvents {
	handlerSweep: [sweptHandlers: Collection<string, IHandler>];
	hashSweep: [sweptHashes: Collection<string, HashData>];
	invalidRequestWarning: [invalidRequestInfo: InvalidRequestWarningData];
	rateLimited: [rateLimitInfo: RateLimitData];
	response: [request: APIRequest, response: ResponseLike];
	restDebug: [info: string];
}

export interface RestEventsMap extends RestEvents {}

/**
 * Options to be passed when creating the REST instance
 */
export interface RESTOptions {
	/**
	 * The agent to set globally
	 */
	agent: Dispatcher | null;
	/**
	 * The base api path, without version
	 *
	 * @defaultValue `'https://discord.com/api'`
	 */
	api: string;
	/**
	 * The authorization prefix to use for requests, useful if you want to use
	 * bearer tokens
	 *
	 * @defaultValue `'Bot'`
	 */
	authPrefix: 'Bearer' | 'Bot';
	/**
	 * The cdn path
	 *
	 * @defaultValue `'https://cdn.discordapp.com'`
	 */
	cdn: string;
	/**
	 * How many requests to allow sending per second (Infinity for unlimited, 50 for the standard global limit used by Discord)
	 *
	 * @defaultValue `50`
	 */
	globalRequestsPerSecond: number;
	/**
	 * The amount of time in milliseconds that passes between each hash sweep. (defaults to 1h)
	 *
	 * @defaultValue `3_600_000`
	 */
	handlerSweepInterval: number;
	/**
	 * The maximum amount of time a hash can exist in milliseconds without being hit with a request (defaults to 24h)
	 *
	 * @defaultValue `86_400_000`
	 */
	hashLifetime: number;
	/**
	 * The amount of time in milliseconds that passes between each hash sweep. (defaults to 4h)
	 *
	 * @defaultValue `14_400_000`
	 */
	hashSweepInterval: number;
	/**
	 * Additional headers to send for all API requests
	 *
	 * @defaultValue `{}`
	 */
	headers: Record<string, string>;
	/**
	 * The number of invalid REST requests (those that return 401, 403, or 429) in a 10 minute window between emitted warnings (0 for no warnings).
	 * That is, if set to 500, warnings will be emitted at invalid request number 500, 1000, 1500, and so on.
	 *
	 * @defaultValue `0`
	 */
	invalidRequestWarningInterval: number;
	/**
	 * The method called to perform the actual HTTP request given a url and web `fetch` options
	 * For example, to use global fetch, simply provide `makeRequest: fetch`
	 */
	makeRequest(url: string, init: RequestInit): Promise<ResponseLike>;
	/**
	 * The media proxy path
	 *
	 * @defaultValue `'https://media.discordapp.net'`
	 */
	mediaProxy: string;
	/**
	 * The extra offset to add to rate limits in milliseconds
	 *
	 * @defaultValue `50`
	 */
	offset: GetRateLimitOffsetFunction | number;
	/**
	 * Determines how rate limiting and pre-emptive throttling should be handled.
	 * When an array of strings, each element is treated as a prefix for the request route
	 * (e.g. `/channels` to match any route starting with `/channels` such as `/channels/:id/messages`)
	 * for which to throw {@link RateLimitError}s. All other request routes will be queued normally
	 *
	 * @defaultValue `null`
	 */
	rejectOnRateLimit: RateLimitQueueFilter | string[] | null;
	/**
	 * The number of retries for errors with the 500 code, or errors
	 * that timeout
	 *
	 * @defaultValue `3`
	 */
	retries: number;
	/**
	 * The time to wait in milliseconds before a request is aborted
	 *
	 * @defaultValue `15_000`
	 */
	timeout: number;
	/**
	 * Extra information to add to the user agent
	 *
	 * @defaultValue DefaultUserAgentAppendix
	 */
	userAgentAppendix: string;
	/**
	 * The version of the API to use
	 *
	 * @defaultValue `'10'`
	 */
	version: string;
}

/**
 * Data emitted on `RESTEvents.RateLimited`
 */
export interface RateLimitData {
	/**
	 * Whether the rate limit that was reached was the global limit
	 */
	global: boolean;
	/**
	 * The bucket hash for this request
	 */
	hash: string;
	/**
	 * The amount of requests we can perform before locking requests
	 */
	limit: number;
	/**
	 * The major parameter of the route
	 *
	 * For example, in `/channels/x`, this will be `x`.
	 * If there is no major parameter (e.g: `/bot/gateway`) this will be `global`.
	 */
	majorParameter: string;
	/**
	 * The HTTP method being performed
	 */
	method: string;
	/**
	 * The time, in milliseconds, that will need to pass before this specific request can be retried
	 */
	retryAfter: number;
	/**
	 * The route being hit in this request
	 */
	route: string;
	/**
	 * The scope of the rate limit that was hit.
	 *
	 * This can be `user` for rate limits that are per client, `global` for rate limits that affect all clients or `shared` for rate limits that
	 * are shared per resource.
	 */
	scope: 'global' | 'shared' | 'user';
	/**
	 * The time, in milliseconds, that will need to pass before the sublimit lock for the route resets, and requests that fall under a sublimit
	 * can be retried
	 *
	 * This is only present on certain sublimits, and `0` otherwise
	 */
	sublimitTimeout: number;
	/**
	 * The time, in milliseconds, until the route's request-lock is reset
	 */
	timeToReset: number;
	/**
	 * The full URL for this request
	 */
	url: string;
}

/**
 * A function that determines whether the rate limit hit should throw an Error
 */
export type RateLimitQueueFilter = (rateLimitData: RateLimitData) => Awaitable<boolean>;

/**
 * A function that determines the rate limit offset for a given request.
 */
export type GetRateLimitOffsetFunction = (route: string) => number;

export interface APIRequest {
	/**
	 * The data that was used to form the body of this request
	 */
	data: HandlerRequestData;
	/**
	 * The HTTP method used in this request
	 */
	method: string;
	/**
	 * Additional HTTP options for this request
	 */
	options: RequestInit;
	/**
	 * The full path used to make the request
	 */
	path: RouteLike;
	/**
	 * The number of times this request has been attempted
	 */
	retries: number;
	/**
	 * The API route identifying the ratelimit for this request
	 */
	route: string;
}

export interface ResponseLike
	extends Pick<Response, 'arrayBuffer' | 'bodyUsed' | 'headers' | 'json' | 'ok' | 'status' | 'statusText' | 'text'> {
	body: Readable | ReadableStream | null;
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

/**
 * Represents a file to be added to the request
 */
export interface RawFile {
	/**
	 * Content-Type of the file
	 */
	contentType?: string;
	/**
	 * The actual data for the file
	 */
	data: Buffer | Uint8Array | boolean | number | string;
	/**
	 * An explicit key to use for key of the formdata field for this file.
	 * When not provided, the index of the file in the files array is used in the form `files[${index}]`.
	 * If you wish to alter the placeholder snowflake, you must provide this property in the same form (`files[${placeholder}]`)
	 */
	key?: string;
	/**
	 * The name of the file
	 */
	name: string;
}

/**
 * Represents possible data to be given to an endpoint
 */
export interface RequestData {
	/**
	 * Whether to append JSON data to form data instead of `payload_json` when sending files
	 */
	appendToFormData?: boolean;
	/**
	 * If this request needs the `Authorization` header
	 *
	 * @defaultValue `true`
	 */
	auth?: boolean;
	/**
	 * The authorization prefix to use for this request, useful if you use this with bearer tokens
	 *
	 * @defaultValue `'Bot'`
	 */
	authPrefix?: 'Bearer' | 'Bot';
	/**
	 * The body to send to this request.
	 * If providing as BodyInit, set `passThroughBody: true`
	 */
	body?: BodyInit | unknown;
	/**
	 * The {@link https://undici.nodejs.org/#/docs/api/Agent | Agent} to use for the request.
	 */
	dispatcher?: Agent;
	/**
	 * Files to be attached to this request
	 */
	files?: RawFile[] | undefined;
	/**
	 * Additional headers to add to this request
	 */
	headers?: Record<string, string>;
	/**
	 * Whether to pass-through the body property directly to `fetch()`.
	 * <warn>This only applies when files is NOT present</warn>
	 */
	passThroughBody?: boolean;
	/**
	 * Query string parameters to append to the called endpoint
	 */
	query?: URLSearchParams;
	/**
	 * Reason to show in the audit logs
	 */
	reason?: string | undefined;
	/**
	 * The signal to abort the queue entry or the REST call, where applicable
	 */
	signal?: AbortSignal | undefined;
	/**
	 * If this request should be versioned
	 *
	 * @defaultValue `true`
	 */
	versioned?: boolean;
}

/**
 * Possible headers for an API call
 */
export interface RequestHeaders {
	Authorization?: string;
	'User-Agent': string;
	'X-Audit-Log-Reason'?: string;
}

/**
 * Possible API methods to be used when doing requests
 */
export enum RequestMethod {
	Delete = 'DELETE',
	Get = 'GET',
	Patch = 'PATCH',
	Post = 'POST',
	Put = 'PUT',
}

export type RouteLike = `/${string}`;

/**
 * Internal request options
 *
 * @internal
 */
export interface InternalRequest extends RequestData {
	fullRoute: RouteLike;
	method: RequestMethod;
}

export type HandlerRequestData = Pick<InternalRequest, 'auth' | 'body' | 'files' | 'signal'>;

/**
 * Parsed route data for an endpoint
 *
 * @internal
 */
export interface RouteData {
	bucketRoute: string;
	majorParameter: string;
	original: RouteLike;
}

/**
 * Represents a hash and its associated fields
 *
 * @internal
 */
export interface HashData {
	lastAccess: number;
	value: string;
}
