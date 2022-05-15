import type { IncomingMessage, ServerResponse } from 'http';
import { DiscordAPIError, parseResponse, RequestMethod, REST, RouteLike } from '@discordjs/rest';

/**
 * Represents a potentially awaitable value
 */
type Awaitable<T> = T | PromiseLike<T>;
/**
 * Represents a simple HTTP request handler
 */
type RequestHandler = (req: IncomingMessage, res: ServerResponse) => Awaitable<void>;

/**
 * Creates an HTTP handler used to forward requests to Discord
 * @param rest REST instance to use for the requests
 */
export function proxyRequests(rest: REST): RequestHandler {
	return async (req, res) => {
		const { method, url: rawUrl } = req;

		if (!method || !rawUrl) {
			throw new TypeError(
				'Invalid request. Missing method and/or url, implying that this is not a Server IncomingMesage',
			);
		}

		const url = rawUrl.replace(/^\/api(\/v\d+)?/, '');

		try {
			const discordResponse = await rest.raw({
				body: req,
				fullRoute: url as RouteLike,
				// This type case is technically incorrect, but we want Discord to throw Method Not Allowed
				method: method as RequestMethod,
				passThroughBody: true,
			});

			res.statusCode = discordResponse.statusCode;

			for (const header of Object.keys(discordResponse.headers)) {
				// Strip ratelimit headers
				if (header.startsWith('x-ratelimit')) {
					continue;
				}

				res.setHeader(header, discordResponse.headers[header]!);
			}

			const data = await parseResponse(discordResponse);
			res.end(discordResponse.headers['content-type']?.startsWith('application/json') ? JSON.stringify(data) : data);
		} catch (error) {
			if (!(error instanceof DiscordAPIError)) {
				// Unclear if there's better course of action here. Any web framework allow to pass in an error handler for something like this
				// at which point the user could dictate what to do with the error - otherwise we could just 500
				throw error;
			}

			res.statusCode = error.status;
			res.statusMessage = error.message;
			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(error.rawError));
		}
	};
}
