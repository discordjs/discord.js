import type { RESTPatchAPIChannelJSONBody } from 'discord-api-types/v10';
import type { Response } from 'node-fetch';
import { RequestMethod } from '../RequestManager';

/**
 * Converts the response to usable data
 * @param res The node-fetch response
 */
export function parseResponse(res: Response): Promise<unknown> {
	if (res.headers.get('Content-Type')?.startsWith('application/json')) {
		return res.json();
	}

	return res.arrayBuffer();
}

/**
 * Check whether a request falls under a sublimit
 * @param bucketRoute The buckets route identifier
 * @param body The options provided as JSON data
 * @param method The HTTP method that will be used to make the request
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
