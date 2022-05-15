import type { IncomingMessage, ServerResponse } from 'http';
import { DiscordAPIError, RequestMethod, REST, RouteLike } from '@discordjs/rest';

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
			const discordResponse = await rest.request({
				body: req,
				// Unsure how safe this cast is
				fullRoute: url as RouteLike,
				method: method as RequestMethod,
				passThroughBody: true,
			});

			// This is a bit of an issue. As per the parseResponse method in REST, `res` will be an ArrayBuffer if the Content-Type
			// Discord provided is for some reason NOT application/json
			// Realistically though folks could be using their own request handler and handle this different, not to mention ideally we'd relay
			// The Content-Type Discord actually returned - unsure what to use here otherwise
			const contentType = ArrayBuffer.isView(discordResponse) ? 'text/plain' : 'application/json';

			// This is also problematic. Some routes return 204, ideally we'd relay that back
			// Could potentially check if `res` is an empty object?
			// Ideally I wouldn't have to re-compute headers and the status code, but REST provides no method to get a raw Response back atm.
			res.statusCode = 200;
			res.setHeader('Content-Type', contentType);
			res.end(JSON.stringify(discordResponse));
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
