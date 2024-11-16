import type { RateLimitData } from '../utils/types.js';

export class RateLimitError extends Error implements RateLimitData {
	public timeToReset: number;

	public limit: number;

	public method: string;

	public hash: string;

	public url: string;

	public route: string;

	public majorParameter: string;

	public global: boolean;

	public retryAfter: number;

	public sublimitTimeout: number;

	public scope: RateLimitData['scope'];

	public constructor({
		timeToReset,
		limit,
		method,
		hash,
		url,
		route,
		majorParameter,
		global,
		retryAfter,
		sublimitTimeout,
		scope,
	}: RateLimitData) {
		super();
		this.timeToReset = timeToReset;
		this.limit = limit;
		this.method = method;
		this.hash = hash;
		this.url = url;
		this.route = route;
		this.majorParameter = majorParameter;
		this.global = global;
		this.retryAfter = retryAfter;
		this.sublimitTimeout = sublimitTimeout;
		this.scope = scope;
	}

	/**
	 * The name of the error
	 */
	public override get name(): string {
		return `${RateLimitError.name}[${this.route}]`;
	}
}
