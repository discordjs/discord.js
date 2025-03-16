import { Collection } from '@discordjs/collection';
import { DiscordSnowflake } from '@sapphire/snowflake';
import { AsyncEventEmitter } from '@vladfrangu/async_event_emitter';
import { filetypeinfo } from 'magic-bytes.js';
import type { RequestInit, BodyInit, Dispatcher } from 'undici';
import { v5 as uuidV5 } from 'uuid';
import { CDN } from './CDN.js';
import { BurstHandler } from './handlers/BurstHandler.js';
import { SequentialHandler } from './handlers/SequentialHandler.js';
import type { IHandler } from './interfaces/Handler.js';
import {
	AUTH_UUID_NAMESPACE,
	BurstHandlerMajorIdKey,
	DefaultRestOptions,
	DefaultUserAgent,
	OverwrittenMimeTypes,
	RESTEvents,
} from './utils/constants.js';
import { RequestMethod } from './utils/types.js';
import type {
	RESTOptions,
	ResponseLike,
	RestEvents,
	HashData,
	InternalRequest,
	RouteLike,
	RequestHeaders,
	RouteData,
	RequestData,
	AuthData,
} from './utils/types.js';
import { isBufferLike, parseResponse } from './utils/utils.js';

/**
 * Represents the class that manages handlers for endpoints
 */
export class REST extends AsyncEventEmitter<RestEvents> {
	/**
	 * The {@link https://undici.nodejs.org/#/docs/api/Agent | Agent} for all requests
	 * performed by this manager.
	 */
	public agent: Dispatcher | null = null;

	public readonly cdn: CDN;

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

	#token: string | null = null;

	private hashTimer!: NodeJS.Timer | number;

	private handlerTimer!: NodeJS.Timer | number;

	public readonly options: RESTOptions;

	public constructor(options: Partial<RESTOptions> = {}) {
		super();
		this.cdn = new CDN(options.cdn ?? DefaultRestOptions.cdn, options.mediaProxy ?? DefaultRestOptions.mediaProxy);
		this.options = { ...DefaultRestOptions, ...options };
		this.globalRemaining = Math.max(1, this.options.globalRequestsPerSecond);
		this.agent = options.agent ?? null;

		// Start sweepers
		this.setupSweepers();
	}

	private setupSweepers() {
		// eslint-disable-next-line unicorn/consistent-function-scoping
		const validateMaxInterval = (interval: number) => {
			if (interval > 14_400_000) {
				throw new Error('Cannot set an interval greater than 4 hours');
			}
		};

		if (this.options.hashSweepInterval !== 0 && this.options.hashSweepInterval !== Number.POSITIVE_INFINITY) {
			validateMaxInterval(this.options.hashSweepInterval);
			this.hashTimer = setInterval(() => {
				const sweptHashes = new Collection<string, HashData>();
				const currentDate = Date.now();

				// Begin sweeping hash based on lifetimes
				this.hashes.sweep((val, key) => {
					// `-1` indicates a global hash
					if (val.lastAccess === -1) return false;

					// Check if lifetime has been exceeded
					const shouldSweep = Math.floor(currentDate - val.lastAccess) > this.options.hashLifetime;

					// Add hash to collection of swept hashes
					if (shouldSweep) {
						// Add to swept hashes
						sweptHashes.set(key, val);

						// Emit debug information
						this.emit(RESTEvents.Debug, `[REST] Hash ${val.value} for ${key} swept due to lifetime being exceeded`);
					}

					return shouldSweep;
				});

				// Fire event
				this.emit(RESTEvents.HashSweep, sweptHashes);
			}, this.options.hashSweepInterval);

			this.hashTimer.unref?.();
		}

		if (this.options.handlerSweepInterval !== 0 && this.options.handlerSweepInterval !== Number.POSITIVE_INFINITY) {
			validateMaxInterval(this.options.handlerSweepInterval);
			this.handlerTimer = setInterval(() => {
				const sweptHandlers = new Collection<string, IHandler>();

				// Begin sweeping handlers based on activity
				this.handlers.sweep((val, key) => {
					const { inactive } = val;

					// Collect inactive handlers
					if (inactive) {
						sweptHandlers.set(key, val);
						this.emit(RESTEvents.Debug, `[REST] Handler ${val.id} for ${key} swept due to being inactive`);
					}

					return inactive;
				});

				// Fire event
				this.emit(RESTEvents.HandlerSweep, sweptHandlers);
			}, this.options.handlerSweepInterval);

			this.handlerTimer.unref?.();
		}
	}

	/**
	 * Runs a get request from the api
	 *
	 * @param fullRoute - The full route to query
	 * @param options - Optional request options
	 */
	public async get(fullRoute: RouteLike, options: RequestData = {}) {
		return this.request({ ...options, fullRoute, method: RequestMethod.Get });
	}

	/**
	 * Runs a delete request from the api
	 *
	 * @param fullRoute - The full route to query
	 * @param options - Optional request options
	 */
	public async delete(fullRoute: RouteLike, options: RequestData = {}) {
		return this.request({ ...options, fullRoute, method: RequestMethod.Delete });
	}

	/**
	 * Runs a post request from the api
	 *
	 * @param fullRoute - The full route to query
	 * @param options - Optional request options
	 */
	public async post(fullRoute: RouteLike, options: RequestData = {}) {
		return this.request({ ...options, fullRoute, method: RequestMethod.Post });
	}

	/**
	 * Runs a put request from the api
	 *
	 * @param fullRoute - The full route to query
	 * @param options - Optional request options
	 */
	public async put(fullRoute: RouteLike, options: RequestData = {}) {
		return this.request({ ...options, fullRoute, method: RequestMethod.Put });
	}

	/**
	 * Runs a patch request from the api
	 *
	 * @param fullRoute - The full route to query
	 * @param options - Optional request options
	 */
	public async patch(fullRoute: RouteLike, options: RequestData = {}) {
		return this.request({ ...options, fullRoute, method: RequestMethod.Patch });
	}

	/**
	 * Runs a request from the api
	 *
	 * @param options - Request options
	 */
	public async request(options: InternalRequest) {
		const response = await this.queueRequest(options);
		return parseResponse(response);
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
	 * @returns The response from the api request
	 */
	public async queueRequest(request: InternalRequest): Promise<ResponseLike> {
		// Generalize the endpoint to its route data
		const routeId = REST.generateRouteData(request.fullRoute, request.method);
		const customAuth = typeof request.auth === 'object' && request.auth.token !== this.#token;
		const auth = customAuth ? uuidV5((request.auth as AuthData).token, AUTH_UUID_NAMESPACE) : request.auth !== false;
		// Get the bucket hash for the generic route, or point to a global route otherwise
		const hash = this.hashes.get(`${request.method}:${routeId.bucketRoute}${customAuth ? `:${auth}` : ''}`) ?? {
			value: `Global(${request.method}:${routeId.bucketRoute}${customAuth ? `:${auth}` : ''})`,
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
			auth,
			signal: request.signal,
		});
	}

	/**
	 * Creates a new rate limit handler from a hash, based on the hash and the major parameter
	 *
	 * @param hash - The hash for the route
	 * @param majorParameter - The major parameter for this handler
	 * @internal
	 */
	private createHandler(hash: string, majorParameter: string) {
		// Create the async request queue to handle requests
		const queue =
			majorParameter === BurstHandlerMajorIdKey
				? new BurstHandler(this, hash, majorParameter)
				: new SequentialHandler(this, hash, majorParameter);
		// Save the queue based on its id
		this.handlers.set(queue.id, queue);

		return queue;
	}

	/**
	 * Formats the request data to a usable format for fetch
	 *
	 * @param request - The request data
	 */
	private async resolveRequest(request: InternalRequest): Promise<{ fetchOptions: RequestInit; url: string }> {
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
			if (typeof request.auth === 'object') {
				headers.Authorization = `${request.auth.prefix ?? this.options.authPrefix} ${request.auth.token}`;
			} else {
				// If we haven't received a token, throw an error
				if (!this.#token) {
					throw new Error('Expected token to be set for this request, but none was present');
				}

				headers.Authorization = `${this.options.authPrefix} ${this.#token}`;
			}
		}

		// If a reason was set, set its appropriate header
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

				// https://developer.mozilla.org/docs/Web/API/FormData/append#parameters
				// FormData.append only accepts a string or Blob.
				// https://developer.mozilla.org/docs/Web/API/Blob/Blob#parameters
				// The Blob constructor accepts TypedArray/ArrayBuffer, strings, and Blobs.
				if (isBufferLike(file.data)) {
					// Try to infer the content type from the buffer if one isn't passed
					let contentType = file.contentType;

					if (!contentType) {
						const [parsedType] = filetypeinfo(file.data);

						if (parsedType) {
							contentType =
								OverwrittenMimeTypes[parsedType.mime as keyof typeof OverwrittenMimeTypes] ??
								parsedType.mime ??
								'application/octet-stream';
						}
					}

					formData.append(fileKey, new Blob([file.data], { type: contentType }), file.name);
				} else {
					formData.append(fileKey, new Blob([`${file.data}`], { type: file.contentType }), file.name);
				}
			}

			// If a JSON body was added as well, attach it to the form data, using payload_json unless otherwise specified
			// eslint-disable-next-line no-eq-null, eqeqeq
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

			// eslint-disable-next-line no-eq-null, eqeqeq
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

		const method = request.method.toUpperCase();

		// The non null assertions in the following block are due to exactOptionalPropertyTypes, they have been tested to work with undefined
		const fetchOptions: RequestInit = {
			// Set body to null on get / head requests. This does not follow fetch spec (likely because it causes subtle bugs) but is aligned with what request was doing
			body: ['GET', 'HEAD'].includes(method) ? null : finalBody!,
			headers: { ...request.headers, ...additionalHeaders, ...headers } as Record<string, string>,
			method,
			// Prioritize setting an agent per request, use the agent for this instance otherwise.
			dispatcher: request.dispatcher ?? this.agent ?? undefined!,
		};

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
	 * @internal
	 */
	private static generateRouteData(endpoint: RouteLike, method: RequestMethod): RouteData {
		if (endpoint.startsWith('/interactions/') && endpoint.endsWith('/callback')) {
			return {
				majorParameter: BurstHandlerMajorIdKey,
				bucketRoute: '/interactions/:id/:token/callback',
				original: endpoint,
			};
		}

		const majorIdMatch = /(?:^\/webhooks\/(\d{17,19}\/[^/?]+))|(?:^\/(?:channels|guilds|webhooks)\/(\d{17,19}))/.exec(
			endpoint,
		);

		// Get the major id or id + token for this route - global otherwise
		const majorId = majorIdMatch?.[2] ?? majorIdMatch?.[1] ?? 'global';

		const baseRoute = endpoint
			// Strip out all ids
			.replaceAll(/\d{17,19}/g, ':id')
			// Strip out reaction as they fall under the same bucket
			.replace(/\/reactions\/(.*)/, '/reactions/:reaction')
			// Strip out webhook tokens
			.replace(/\/webhooks\/:id\/[^/?]+/, '/webhooks/:id/:token');

		let exceptions = '';

		// Hard-Code Old Message Deletion Exception (2 week+ old messages are a different bucket)
		// https://github.com/discord/discord-api-docs/issues/1295
		if (method === RequestMethod.Delete && baseRoute === '/channels/:id/messages/:id') {
			const id = /\d{17,19}$/.exec(endpoint)![0]!;
			const timestamp = DiscordSnowflake.timestampFrom(id);
			if (Date.now() - timestamp > 1_000 * 60 * 60 * 24 * 14) {
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
