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

	public constructor(data: RateLimitData) {
		super();
		this.timeToReset = data.timeToReset;
		this.limit = data.limit;
		this.method = data.method;
		this.hash = data.hash;
		this.url = data.url;
		this.route = data.route;
		this.majorParameter = data.majorParameter;
		this.global = data.global;
		this.retryAfter = data.retryAfter;
		this.sublimitTimeout = data.sublimitTimeout;
		this.scope = data.scope;
	}

	/**
	 * The name of the error
	 */
	public override get name(): string {
		return `${RateLimitError.name}[${this.route}]`;
	}
}
