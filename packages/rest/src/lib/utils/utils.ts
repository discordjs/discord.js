import { Blob, Buffer } from 'node:buffer';
import { URLSearchParams } from 'node:url';
import { types } from 'node:util';
import type { RESTPatchAPIChannelJSONBody } from 'discord-api-types/v10';
import { FormData, type Dispatcher, type RequestInit } from 'undici';
import type { RequestOptions } from '../REST.js';
import { RequestMethod } from '../RequestManager.js';

export function parseHeader(header: string[] | string | undefined): string | undefined {
	if (header === undefined) {
		return header;
	} else if (typeof header === 'string') {
		return header;
	}

	return header.join(';');
}

function serializeSearchParam(value: unknown): string | null {
	switch (typeof value) {
		case 'string':
			return value;
		case 'number':
		case 'bigint':
		case 'boolean':
			return value.toString();
		case 'object':
			if (value === null) return null;
			if (value instanceof Date) {
				return Number.isNaN(value.getTime()) ? null : value.toISOString();
			}

			// eslint-disable-next-line @typescript-eslint/no-base-to-string
			if (typeof value.toString === 'function' && value.toString !== Object.prototype.toString) return value.toString();
			return null;
		default:
			return null;
	}
}

/**
 * Creates and populates an URLSearchParams instance from an object, stripping
 * out null and undefined values, while also coercing non-strings to strings.
 *
 * @param options - The options to use
 * @returns A populated URLSearchParams instance
 */
export function makeURLSearchParams(options?: Record<string, unknown>) {
	const params = new URLSearchParams();
	if (!options) return params;

	for (const [key, value] of Object.entries(options)) {
		const serialized = serializeSearchParam(value);
		if (serialized !== null) params.append(key, serialized);
	}

	return params;
}

/**
 * Converts the response to usable data
 *
 * @param res - The fetch response
 */
export async function parseResponse(res: Dispatcher.ResponseData): Promise<unknown> {
	const header = parseHeader(res.headers['content-type']);
	if (header?.startsWith('application/json')) {
		return res.body.json();
	}

	return res.body.arrayBuffer();
}

/**
 * Check whether a request falls under a sublimit
 *
 * @param bucketRoute - The buckets route identifier
 * @param body - The options provided as JSON data
 * @param method - The HTTP method that will be used to make the request
 * @returns Whether the request falls under a sublimit
 */
export function hasSublimit(bucketRoute: string, body?: unknown, method?: string): boolean {
	// TODO: Update for new sublimits
	// Currently known sublimits:
	// Editing channel `name` or `topic`
	if (bucketRoute === '/channels/:id') {
		if (typeof body !== 'object' || body === null) return false;
		// This should never be a POST body, but just in case
		if (method !== RequestMethod.Patch) return false;
		const castedBody = body as RESTPatchAPIChannelJSONBody;
		return ['name', 'topic'].some((key) => Reflect.has(castedBody, key));
	}

	// If we are checking if a request has a sublimit on a route not checked above, sublimit all requests to avoid a flood of 429s
	return true;
}

export async function resolveBody(body: RequestInit['body']): Promise<RequestOptions['body']> {
	// eslint-disable-next-line no-eq-null, eqeqeq
	if (body == null) {
		return null;
	} else if (typeof body === 'string') {
		return body;
	} else if (types.isUint8Array(body)) {
		return body;
	} else if (types.isArrayBuffer(body)) {
		return new Uint8Array(body);
	} else if (body instanceof URLSearchParams) {
		return body.toString();
	} else if (body instanceof DataView) {
		return new Uint8Array(body.buffer);
	} else if (body instanceof Blob) {
		return new Uint8Array(await body.arrayBuffer());
	} else if (body instanceof FormData) {
		return body;
	} else if ((body as Iterable<Uint8Array>)[Symbol.iterator]) {
		const chunks = [...(body as Iterable<Uint8Array>)];
		const length = chunks.reduce((a, b) => a + b.length, 0);

		const uint8 = new Uint8Array(length);
		let lengthUsed = 0;

		return chunks.reduce((a, b) => {
			a.set(b, lengthUsed);
			lengthUsed += b.length;
			return a;
		}, uint8);
	} else if ((body as AsyncIterable<Uint8Array>)[Symbol.asyncIterator]) {
		const chunks: Uint8Array[] = [];

		for await (const chunk of body as AsyncIterable<Uint8Array>) {
			chunks.push(chunk);
		}

		return Buffer.concat(chunks);
	}

	throw new TypeError(`Unable to resolve body.`);
}
