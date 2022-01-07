import Collection from '@discordjs/collection';
import FormData from 'form-data';
import { DiscordSnowflake } from '@sapphire/snowflake';
import { EventEmitter } from 'node:events';
import { Agent } from 'node:https';
import type { RequestInit, BodyInit } from 'node-fetch';
import type { IHandler } from './handlers/IHandler';
import { SequentialHandler } from './handlers/SequentialHandler';
import type { RESTOptions, RestEvents } from './REST';
import { DefaultRestOptions, DefaultUserAgent } from './utils/constants';

let agent: Agent | null = null;

/**
 * Represents an attachment to be added to the request
 */
export interface RawAttachment {
	/**
	 * The name of the file
	 */
	fileName: string;
	/**
	 * An explicit key to use for key of the formdata field for this attachment.
	 * When not provided, the index of the file in the attachments array is used in the form `files[${index}]`.
	 * If you wish to alter the placeholder snowflake, you must provide this property in the same form (`files[${placeholder}]`)
	 */
	key?: string;
	/**
	 * The actual data for the attachment
	 */
	rawBuffer: Buffer;
}

/**
 * Represents possible data to be given to an endpoint
 */
export interface RequestData {
	/**
	 * Whether to append JSON data to form data instead of `payload_json` when sending attachments
	 */
	appendToFormData?: boolean;
	/**
	 * Files to be attached to this request
	 */
	attachments?: RawAttachment[] | undefined;
	/**
	 * If this request needs the `Authorization` header
	 * @default true
	 */
	auth?: boolean;
	/**
	 * The authorization prefix to use for this request, useful if you use this with bearer tokens
	 * @default 'Bot'
	 */
	authPrefix?: 'Bot' | 'Bearer';
	/**
	 * The body to send to this request.
	 * If providing as BodyInit, set `passThroughBody: true`
	 */
	body?: BodyInit | unknown;
	/**
	 * Additional headers to add to this request
	 */
	headers?: Record<string, string>;
	/**
	 * Whether to pass-through the body property directly to `fetch()`.
	 * <warn>This only applies when attachments is NOT present</warn>
	 */
	passThroughBody?: boolean;
	/**
	 * Query string parameters to append to the called endpoint
	 */
	query?: URLSearchParams;
	/**
	 * Reason to show in the audit logs
	 */
	reason?: string;
	/**
	 * If this request should be versioned
	 * @default true
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
export const enum RequestMethod {
	Delete = 'delete',
	Get = 'get',
	Patch = 'patch',
	Post = 'post',
	Put = 'put',
}

export type RouteLike = `/${string}`;

/**
 * Internal request options
 *
 * @internal
 */
export interface InternalRequest extends RequestData {
	method: RequestMethod;
	fullRoute: RouteLike;
}

/**
 * Parsed route data for an endpoint
 *
 * @internal
 */
export interface RouteData {
	majorParameter: string;
	bucketRoute: string;
	original: RouteLike;
}

export interface RequestManager {
	on<K extends keyof RestEvents>(event: K, listener: (...args: RestEvents[K]) => void): this;
	on<S extends string | symbol>(event: Exclude<S, keyof RestEvents>, listener: (...args: any[]) => void): this;

	once<K extends keyof RestEvents>(event: K, listener: (...args: RestEvents[K]) => void): this;
	once<S extends string | symbol>(event: Exclude<S, keyof RestEvents>, listener: (...args: any[]) => void): this;

	emit<K extends keyof RestEvents>(event: K, ...args: RestEvents[K]): boolean;
	emit<S extends string | symbol>(event: Exclude<S, keyof RestEvents>, ...args: any[]): boolean;

	off<K extends keyof RestEvents>(event: K, listener: (...args: RestEvents[K]) => void): this;
	off<S extends string | symbol>(event: Exclude<S, keyof RestEvents>, listener: (...args: any[]) => void): this;

	removeAllListeners<K extends keyof RestEvents>(event?: K): this;
	removeAllListeners<S extends string | symbol>(event?: Exclude<S, keyof RestEvents>): this;
}

/**
 * Represents the class that manages handlers for endpoints
 */
export class RequestManager extends EventEmitter {
	/**
	 * The number of requests remaining in the global bucket
	 */
	public globalRemaining: number;

	/**
	 * The promise used to wait out the global rate limit
	 */
	public globalDelay: Promise<void> | null = null;

	/**
	 * The timestamp at which the global bucket resets
	 */
	public globalReset = -1;

	/**
	 * API bucket hashes that are cached from provided routes
	 */
	public readonly hashes = new Collection<string, string>();

	/**
	 * Request handlers created from the bucket hash and the major parameters
	 */
	public readonly handlers = new Collection<string, IHandler>();

	// eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
	#token: string | null = null;

	public readonly options: RESTOptions;

	public constructor(options: Partial<RESTOptions>) {
		super();
		this.options = { ...DefaultRestOptions, ...options };
		this.options.offset = Math.max(0, this.options.offset);
		this.globalRemaining = this.options.globalRequestsPerSecond;
	}

	/**
	 * Sets the authorization token that should be used for requests
	 * @param token The authorization token to use
	 */
	public setToken(token: string) {
		this.#token = token;
		return this;
	}

	/**
	 * Queues a request to be sent
	 * @param request All the information needed to make a request
	 * @returns The response from the api request
	 */
	public async queueRequest(request: InternalRequest): Promise<unknown> {
		// Generalize the endpoint to its route data
		const routeId = RequestManager.generateRouteData(request.fullRoute, request.method);
		// Get the bucket hash for the generic route, or point to a global route otherwise
		const hash =
			this.hashes.get(`${request.method}:${routeId.bucketRoute}`) ?? `Global(${request.method}:${routeId.bucketRoute})`;

		// Get the request handler for the obtained hash, with its major parameter
		const handler =
			this.handlers.get(`${hash}:${routeId.majorParameter}`) ?? this.createHandler(hash, routeId.majorParameter);

		// Resolve the request into usable fetch/node-fetch options
		const { url, fetchOptions } = this.resolveRequest(request);

		// Queue the request
		return handler.queueRequest(routeId, url, fetchOptions, { body: request.body, attachments: request.attachments });
	}

	/**
	 * Creates a new rate limit handler from a hash, based on the hash and the major parameter
	 * @param hash The hash for the route
	 * @param majorParameter The major parameter for this handler
	 * @private
	 */
	private createHandler(hash: string, majorParameter: string) {
		// Create the async request queue to handle requests
		const queue = new SequentialHandler(this, hash, majorParameter);
		// Save the queue based on its id
		this.handlers.set(queue.id, queue);

		return queue;
	}

	/**
	 * Formats the request data to a usable format for fetch
	 * @param request The request data
	 */
	private resolveRequest(request: InternalRequest): { url: string; fetchOptions: RequestInit } {
		const { options } = this;

		agent ??= new Agent({ ...options.agent, keepAlive: true });

		let query = '';

		// If a query option is passed, use it
		if (request.query) {
			query = `?${request.query.toString()}`;
		}

		// Create the required headers
		const headers: RequestHeaders = {
			...this.options.headers,
			'User-Agent': `${DefaultUserAgent} ${options.userAgentAppendix}`.trim(),
		};

		// If this request requires authorization (allowing non-"authorized" requests for webhooks)
		if (request.auth !== false) {
			// If we haven't received a token, throw an error
			if (!this.#token) {
				throw new Error('Expected token to be set for this request, but none was present');
			}

			headers.Authorization = `${request.authPrefix ?? 'Bot'} ${this.#token}`;
		}

		// If a reason was set, set it's appropriate header
		if (request.reason?.length) {
			headers['X-Audit-Log-Reason'] = encodeURIComponent(request.reason);
		}

		// Format the full request URL (api base, optional version, endpoint, optional querystring)
		const url = `${options.api}${request.versioned === false ? '' : `/v${options.version}`}${
			request.fullRoute
		}${query}`;

		let finalBody: RequestInit['body'];
		let additionalHeaders: Record<string, string> = {};

		if (request.attachments?.length) {
			const formData = new FormData();

			// Attach all files to the request
			for (const [index, attachment] of request.attachments.entries()) {
				formData.append(attachment.key ?? `files[${index}]`, attachment.rawBuffer, attachment.fileName);
			}

			// If a JSON body was added as well, attach it to the form data, using payload_json unless otherwise specified
			// eslint-disable-next-line no-eq-null
			if (request.body != null) {
				if (request.appendToFormData) {
					for (const [key, value] of Object.entries(request.body as Record<string, unknown>)) {
						formData.append(key, value);
					}
				} else {
					formData.append('payload_json', JSON.stringify(request.body));
				}
			}

			// Set the final body to the form data
			finalBody = formData;
			// Set the additional headers to the form data ones
			additionalHeaders = formData.getHeaders();

			// eslint-disable-next-line no-eq-null
		} else if (request.body != null) {
			if (request.passThroughBody) {
				finalBody = request.body as BodyInit;
			} else {
				// Stringify the JSON data
				finalBody = JSON.stringify(request.body);
				// Set the additional headers to specify the content-type
				additionalHeaders = { 'Content-Type': 'application/json' };
			}
		}

		const fetchOptions = {
			agent,
			body: finalBody,
			// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
			headers: { ...(request.headers ?? {}), ...additionalHeaders, ...headers } as Record<string, string>,
			method: request.method,
		};

		return { url, fetchOptions };
	}

	/**
	 * Generates route data for an endpoint:method
	 * @param endpoint The raw endpoint to generalize
	 * @param method The HTTP method this endpoint is called without
	 * @private
	 */
	private static generateRouteData(endpoint: RouteLike, method: RequestMethod): RouteData {
		const majorIdMatch = /^\/(?:channels|guilds|webhooks)\/(\d{16,19})/.exec(endpoint);

		// Get the major id for this route - global otherwise
		const majorId = majorIdMatch?.[1] ?? 'global';

		const baseRoute = endpoint
			// Strip out all ids
			.replace(/\d{16,19}/g, ':id')
			// Strip out reaction as they fall under the same bucket
			.replace(/\/reactions\/(.*)/, '/reactions/:reaction');

		let exceptions = '';

		// Hard-Code Old Message Deletion Exception (2 week+ old messages are a different bucket)
		// https://github.com/discord/discord-api-docs/issues/1295
		if (method === RequestMethod.Delete && baseRoute === '/channels/:id/messages/:id') {
			const id = /\d{16,19}$/.exec(endpoint)![0];
			const snowflake = DiscordSnowflake.deconstruct(id);
			if (Date.now() - Number(snowflake.timestamp) > 1000 * 60 * 60 * 24 * 14) {
				exceptions += '/Delete Old Message';
			}
		}

		return {
			majorParameter: majorId,
			bucketRoute: baseRoute + exceptions,
			original: endpoint,
		};
	}
}
