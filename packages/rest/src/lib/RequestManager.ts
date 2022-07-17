import { Blob } from 'node:buffer';
import { EventEmitter } from 'node:events';
import { Collection } from '@discordjs/collection';
import { DiscordSnowflake } from '@sapphire/snowflake';
import { FormData, type RequestInit, type BodyInit, type Dispatcher, Agent } from 'undici';
import type { RESTOptions, RestEvents, RequestOptions } from './REST';
import type { IHandler } from './handlers/IHandler';
import { SequentialHandler } from './handlers/SequentialHandler';
import { DefaultRestOptions, DefaultUserAgent, RESTEvents } from './utils/constants';
import { resolveBody } from './utils/utils';

// Make this a lazy dynamic import as file-type is a pure ESM package
const getFileType = (): Promise<typeof import('file-type')> => {
	let cached: Promise<typeof import('file-type')>;
	return (cached ??= import('file-type'));
};

/**
 * Represents a file to be added to the request
 */
export interface RawFile {
	/**
	 * The name of the file
	 */
	name: string;
	/**
	 * An explicit key to use for key of the formdata field for this file.
	 * When not provided, the index of the file in the files array is used in the form `files[${index}]`.
	 * If you wish to alter the placeholder snowflake, you must provide this property in the same form (`files[${placeholder}]`)
	 */
	key?: string;
	/**
	 * The actual data for the file
	 */
	data: string | number | boolean | Buffer;
	/**
	 * Content-Type of the file
	 */
	contentType?: string;
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
	 * @default true
	 */
	auth?: boolean;
	/**
	 * The authorization prefix to use for this request, useful if you use this with bearer tokens
	 *
	 * @default 'Bot'
	 */
	authPrefix?: 'Bot' | 'Bearer';
	/**
	 * The body to send to this request.
	 * If providing as BodyInit, set `passThroughBody: true`
	 */
	body?: BodyInit | unknown;
	/**
	 * The {@link https://undici.nodejs.org/#/docs/api/Agent Agent} to use for the request.
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
	reason?: string;
	/**
	 * If this request should be versioned
	 *
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
	method: RequestMethod;
	fullRoute: RouteLike;
}

export type HandlerRequestData = Pick<InternalRequest, 'files' | 'body' | 'auth'>;

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

/**
 * Represents a hash and its associated fields
 *
 * @internal
 */
export interface HashData {
	value: string;
	lastAccess: number;
}

export interface RequestManager {
	on: (<K extends keyof RestEvents>(event: K, listener: (...args: RestEvents[K]) => void) => this) &
		(<S extends string | symbol>(event: Exclude<S, keyof RestEvents>, listener: (...args: any[]) => void) => this);

	once: (<K extends keyof RestEvents>(event: K, listener: (...args: RestEvents[K]) => void) => this) &
		(<S extends string | symbol>(event: Exclude<S, keyof RestEvents>, listener: (...args: any[]) => void) => this);

	emit: (<K extends keyof RestEvents>(event: K, ...args: RestEvents[K]) => boolean) &
		(<S extends string | symbol>(event: Exclude<S, keyof RestEvents>, ...args: any[]) => boolean);

	off: (<K extends keyof RestEvents>(event: K, listener: (...args: RestEvents[K]) => void) => this) &
		(<S extends string | symbol>(event: Exclude<S, keyof RestEvents>, listener: (...args: any[]) => void) => this);

	removeAllListeners: (<K extends keyof RestEvents>(event?: K) => this) &
		(<S extends string | symbol>(event?: Exclude<S, keyof RestEvents>) => this);
}

/**
 * Represents the class that manages handlers for endpoints
 */
export class RequestManager extends EventEmitter {
	/**
	 * The {@link https://undici.nodejs.org/#/docs/api/Agent Agent} for all requests
	 * performed by this manager.
	 */
	public agent: Dispatcher | null = null;
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
	public readonly hashes = new Collection<string, HashData>();

	/**
	 * Request handlers created from the bucket hash and the major parameters
	 */
	public readonly handlers = new Collection<string, IHandler>();

	// eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
	#token: string | null = null;

	private hashTimer!: NodeJS.Timer;
	private handlerTimer!: NodeJS.Timer;

	public readonly options: RESTOptions;

	public constructor(options: Partial<RESTOptions>) {
		super();
		this.options = { ...DefaultRestOptions, ...options };
		this.options.offset = Math.max(0, this.options.offset);
		this.globalRemaining = this.options.globalRequestsPerSecond;
		this.agent = options.agent ?? null;

		// Start sweepers
		this.setupSweepers();
	}

	private setupSweepers() {
		const validateMaxInterval = (interval: number) => {
			if (interval > 14_400_000) {
				throw new Error('Cannot set an interval greater than 4 hours');
			}
		};

		if (this.options.hashSweepInterval !== 0 && this.options.hashSweepInterval !== Infinity) {
			validateMaxInterval(this.options.hashSweepInterval);
			this.hashTimer = setInterval(() => {
				const sweptHashes = new Collection<string, HashData>();
				const currentDate = Date.now();

				// Begin sweeping hash based on lifetimes
				this.hashes.sweep((v, k) => {
					// `-1` indicates a global hash
					if (v.lastAccess === -1) return false;

					// Check if lifetime has been exceeded
					const shouldSweep = Math.floor(currentDate - v.lastAccess) > this.options.hashLifetime;

					// Add hash to collection of swept hashes
					if (shouldSweep) {
						// Add to swept hashes
						sweptHashes.set(k, v);
					}

					// Emit debug information
					this.emit(RESTEvents.Debug, `Hash ${v.value} for ${k} swept due to lifetime being exceeded`);

					return shouldSweep;
				});

				// Fire event
				this.emit(RESTEvents.HashSweep, sweptHashes);
			}, this.options.hashSweepInterval).unref();
		}

		if (this.options.handlerSweepInterval !== 0 && this.options.handlerSweepInterval !== Infinity) {
			validateMaxInterval(this.options.handlerSweepInterval);
			this.handlerTimer = setInterval(() => {
				const sweptHandlers = new Collection<string, IHandler>();

				// Begin sweeping handlers based on activity
				this.handlers.sweep((v, k) => {
					const { inactive } = v;

					// Collect inactive handlers
					if (inactive) {
						sweptHandlers.set(k, v);
					}

					this.emit(RESTEvents.Debug, `Handler ${v.id} for ${k} swept due to being inactive`);
					return inactive;
				});

				// Fire event
				this.emit(RESTEvents.HandlerSweep, sweptHandlers);
			}, this.options.handlerSweepInterval).unref();
		}
	}

	/**
	 * Sets the default agent to use for requests performed by this manager
	 *
	 * @param agent - The agent to use
	 */
	public setAgent(agent: Dispatcher) {
		this.agent = agent;
		return this;
	}

	/**
	 * Sets the authorization token that should be used for requests
	 *
	 * @param token - The authorization token to use
	 */
	public setToken(token: string) {
		this.#token = token;
		return this;
	}

	/**
	 * Queues a request to be sent
	 *
	 * @param request - All the information needed to make a request
	 *
	 * @returns The response from the api request
	 */
	public async queueRequest(request: InternalRequest): Promise<Dispatcher.ResponseData> {
		// Generalize the endpoint to its route data
		const routeId = RequestManager.generateRouteData(request.fullRoute, request.method);
		// Get the bucket hash for the generic route, or point to a global route otherwise
		const hash = this.hashes.get(`${request.method}:${routeId.bucketRoute}`) ?? {
			value: `Global(${request.method}:${routeId.bucketRoute})`,
			lastAccess: -1,
		};

		// Get the request handler for the obtained hash, with its major parameter
		const handler =
			this.handlers.get(`${hash.value}:${routeId.majorParameter}`) ??
			this.createHandler(hash.value, routeId.majorParameter);

		// Resolve the request into usable fetch options
		const { url, fetchOptions } = await this.resolveRequest(request);

		// Queue the request
		return handler.queueRequest(routeId, url, fetchOptions, {
			body: request.body,
			files: request.files,
			auth: request.auth !== false,
		});
	}

	/**
	 * Creates a new rate limit handler from a hash, based on the hash and the major parameter
	 *
	 * @param hash - The hash for the route
	 * @param majorParameter - The major parameter for this handler
	 *
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
	 *
	 * @param request - The request data
	 */
	private async resolveRequest(request: InternalRequest): Promise<{ url: string; fetchOptions: RequestOptions }> {
		const { options } = this;

		let query = '';

		// If a query option is passed, use it
		if (request.query) {
			const resolvedQuery = request.query.toString();
			if (resolvedQuery !== '') {
				query = `?${resolvedQuery}`;
			}
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

			headers.Authorization = `${request.authPrefix ?? this.options.authPrefix} ${this.#token}`;
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

		if (request.files?.length) {
			const formData = new FormData();

			// Attach all files to the request
			for (const [index, file] of request.files.entries()) {
				const fileKey = file.key ?? `files[${index}]`;

				// https://developer.mozilla.org/en-US/docs/Web/API/FormData/append#parameters
				// FormData.append only accepts a string or Blob.
				// https://developer.mozilla.org/en-US/docs/Web/API/Blob/Blob#parameters
				// The Blob constructor accepts TypedArray/ArrayBuffer, strings, and Blobs.
				if (Buffer.isBuffer(file.data)) {
					// Try to infer the content type from the buffer if one isn't passed
					const { fileTypeFromBuffer } = await getFileType();
					const contentType = file.contentType ?? (await fileTypeFromBuffer(file.data))?.mime;
					formData.append(fileKey, new Blob([file.data], { type: contentType }), file.name);
				} else {
					// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
					formData.append(fileKey, new Blob([`${file.data}`], { type: file.contentType }), file.name);
				}
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

		finalBody = await resolveBody(finalBody);

		const fetchOptions: RequestOptions = {
			// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
			headers: { ...(request.headers ?? {}), ...additionalHeaders, ...headers } as Record<string, string>,
			method: request.method.toUpperCase() as Dispatcher.HttpMethod,
		};

		if (finalBody !== undefined) {
			fetchOptions.body = finalBody as Exclude<RequestOptions['body'], undefined>;
		}

		// Prioritize setting an agent per request, use the agent for this instance otherwise.
		fetchOptions.dispatcher = request.dispatcher ?? this.agent ?? undefined!;

		return { url, fetchOptions };
	}

	/**
	 * Stops the hash sweeping interval
	 */
	public clearHashSweeper() {
		clearInterval(this.hashTimer);
	}

	/**
	 * Stops the request handler sweeping interval
	 */
	public clearHandlerSweeper() {
		clearInterval(this.handlerTimer);
	}

	/**
	 * Generates route data for an endpoint:method
	 *
	 * @param endpoint - The raw endpoint to generalize
	 * @param method - The HTTP method this endpoint is called without
	 *
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
			const id = /\d{16,19}$/.exec(endpoint)![0]!;
			const timestamp = DiscordSnowflake.timestampFrom(id);
			if (Date.now() - timestamp > 1000 * 60 * 60 * 24 * 14) {
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
