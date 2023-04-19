import { URL } from 'node:url';
import type { RequestMethod, REST, RouteLike } from '@discordjs/rest';
import { populateSuccessfulResponse, populateErrorResponse } from '../util/responseHelpers.js';
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
		const parsedUrl = new URL(url, 'http://noop');
		// eslint-disable-next-line unicorn/no-unsafe-regex, prefer-named-capture-group
		const fullRoute = parsedUrl.pathname.replace(/^\/api(\/v\d+)?/, '') as RouteLike;

		const headers: Record<string, string> = {
			'Content-Type': req.headers['content-type']!,
		};

		if (req.headers.authorization) {
			headers.authorization = req.headers.authorization;
		}

		try {
			const discordResponse = await rest.raw({
				body: req,
				fullRoute,
				// This type cast is technically incorrect, but we want Discord to throw Method Not Allowed for us
				method: method as RequestMethod,
				// We forward the auth header anwyay
				auth: false,
				passThroughBody: true,
				query: parsedUrl.searchParams,
				headers,
			});

			await populateSuccessfulResponse(res, discordResponse);
		} catch (error) {
			const knownError = await populateErrorResponse(res, error);
			if (!knownError) {
				// Unclear if there's better course of action here for unknown errors.
				// Any web framework allows to pass in an error handler for something like this
				// at which point the user could dictate what to do with the error - otherwise we could just 500
				throw error;
			}
		} finally {
			res.end();
		}
	};
}
