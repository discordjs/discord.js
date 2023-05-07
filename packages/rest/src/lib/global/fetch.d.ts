import type * as undici from 'undici';

declare global {
	export const { fetch, FormData, Headers, Request, Response }: typeof undici;
}
