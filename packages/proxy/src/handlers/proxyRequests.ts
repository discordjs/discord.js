import { URL } from 'node:url';
import {
	DiscordAPIError,
	HTTPError,
	RateLimitError,
	type RequestMethod,
	type REST,
	type RouteLike,
} from '@discordjs/rest';
import {
	populateAbortErrorResponse,
	populateGeneralErrorResponse,
	populateSuccessfulResponse,
	populateRatelimitErrorResponse,
} from '../util/responseHelpers.js';
import type { RequestHandler } from '../util/util';

/**
 * Creates an HTTP handler used to forward requests to Discord
 *
 * @param rest - REST instance to use for the requests
 */
export function proxyRequests(rest: REST): RequestHandler {
	return async (req, res) => {
		const { method, url } = req;

		if (!method || !url) {
			throw new TypeError(
				'Invalid request. Missing method and/or url, implying that this is not a Server IncomingMessage',
			);
		}

		// The 2nd parameter is here so the URL constructor doesn't complain about an "invalid url" when the origin is missing
		// we don't actually care about the origin and the value passed is irrelevant
		// eslint-disable-next-line prefer-named-capture-group, unicorn/no-unsafe-regex
		const fullRoute = new URL(url, 'http://noop').pathname.replace(/^\/api(\/v\d+)?/, '') as RouteLike;

		try {
			const discordResponse = await rest.raw({
				body: req,
				fullRoute,
				// This type cast is technically incorrect, but we want Discord to throw Method Not Allowed for us
				method: method as RequestMethod,
				passThroughBody: true,
				headers: {
					'Content-Type': req.headers['content-type']!,
				},
			});

			await populateSuccessfulResponse(res, discordResponse);
		} catch (error) {
			if (error instanceof DiscordAPIError || error instanceof HTTPError) {
				populateGeneralErrorResponse(res, error);
			} else if (error instanceof RateLimitError) {
				populateRatelimitErrorResponse(res, error);
			} else if (error instanceof Error && error.name === 'AbortError') {
				populateAbortErrorResponse(res);
			} else {
				// Unclear if there's better course of action here for unknown erorrs. Any web framework allows to pass in an error handler for something like this
				// at which point the user could dictate what to do with the error - otherwise we could just 500
				throw error;
			}
		} finally {
			res.end();
		}
	};
}
