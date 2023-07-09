import { Buffer } from 'node:buffer';
import { URLSearchParams } from 'node:url';
import { types } from 'node:util';
import { type RequestInit, request } from 'undici';
import type { ResponseLike } from '../index.js';

export type RequestOptions = Exclude<Parameters<typeof request>[1], undefined>;

export async function makeRequest(url: string, init: RequestInit): Promise<ResponseLike> {
	// The cast is necessary because `headers` and `method` are narrower types in `undici.request`
	// our request path guarantees they are of acceptable type for `undici.request`
	const options = {
		...init,
		body: await resolveBody(init.body),
	} as RequestOptions;
	const res = await request(url, options);
	return {
		body: res.body,
		async arrayBuffer() {
			return res.body.arrayBuffer();
		},
		async json() {
			return res.body.json();
		},
		async text() {
			return res.body.text();
		},
		get bodyUsed() {
			return res.body.bodyUsed;
		},
		headers: new Headers(res.headers as Record<string, string[] | string>),
		status: res.statusCode,
		ok: res.statusCode >= 200 && res.statusCode < 300,
	};
}

export async function resolveBody(body: RequestInit['body']): Promise<Exclude<RequestOptions['body'], undefined>> {
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

		return Buffer.concat(chunks);
	} else if ((body as AsyncIterable<Uint8Array>)[Symbol.asyncIterator]) {
		const chunks: Uint8Array[] = [];

		for await (const chunk of body as AsyncIterable<Uint8Array>) {
			chunks.push(chunk);
		}

		return Buffer.concat(chunks);
	}

	throw new TypeError(`Unable to resolve body.`);
}
