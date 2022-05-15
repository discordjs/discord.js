import type { IncomingMessage, ServerResponse } from 'http';
import { DiscordAPIError, parseResponse, RequestMethod, REST, RouteLike } from '@discordjs/rest';

type Awaitable<T> = T | PromiseLike<T>;
type RequestHandler = (req: IncomingMessage, res: ServerResponse) => Awaitable<void>;

export const VALID_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

export function proxyRequests(rest: REST): RequestHandler {
	return async (req, res) => {
		// TODO: Parse the URL. REST always appends /api/v[version]
		const { method, url } = req;

		if (!method || !url) {
			throw new TypeError(
				'Invalid request. Missing method and/or url, implying that this is not a Server IncomingMesage',
			);
		}

		if (!VALID_METHODS.includes(method)) {
			throw new Error(`Invalid request method: ${method}`);
		}

		try {
			const discordResponse = await rest.raw({
				body: req,
				fullRoute: url as RouteLike,
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
			res.end(discordResponse.headers['content-type']?.startsWith('application/json') ? data : JSON.stringify(data));
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
