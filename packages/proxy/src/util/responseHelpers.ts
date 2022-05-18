import type { ServerResponse } from 'node:http';
import { DiscordAPIError, parseResponse, RateLimitError } from '@discordjs/rest';
import type { Dispatcher } from 'undici';

/**
 * Populates a server response with the data from a Discord 2xx REST response
 * @param res The server response to populate
 * @param data The data to populate the response with
 */
export async function populateOkResponse(res: ServerResponse, data: Dispatcher.ResponseData): Promise<void> {
	res.statusCode = data.statusCode;

	for (const header of Object.keys(data.headers)) {
		// Strip ratelimit headers
		if (header.startsWith('x-ratelimit')) {
			continue;
		}

		res.setHeader(header, data.headers[header]!);
	}

	const parsed = await parseResponse(data);
	res.write(data.headers['content-type']?.startsWith('application/json') ? JSON.stringify(parsed) : parsed);
}

/**
 * Populates a server response with the data from a Discord non-2xx REST response that is NOT a 429
 * @param res The server response to populate
 * @param error The error to populate the response with
 */
export function populateGeneralErrorResponse(res: ServerResponse, error: DiscordAPIError): void {
	res.statusCode = error.status;
	res.statusMessage = error.message;
	res.setHeader('Content-Type', 'application/json');
	res.write(JSON.stringify(error.rawError));
}

/**
 * Populates a server response with the data from a Discord 429 REST response
 * @param res The server response to populate
 * @param error The error to populate the response with
 */
export function populateRatelimitErrorResponse(res: ServerResponse, error: RateLimitError): void {
	res.statusCode = 429;
	res.setHeader('Retry-After', error.timeToReset / 1000);
}
