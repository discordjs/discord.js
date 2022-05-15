import type { IncomingMessage, ServerResponse } from 'http';
import { DiscordAPIError, RequestMethod, REST, RESTOptions } from '@discordjs/rest';

type Awaitable<T> = T | PromiseLike<T>;
type NextHandler = (err?: string | Error) => Awaitable<void>;
type RequestHandler = (req: IncomingMessage, res: ServerResponse, next: NextHandler) => Awaitable<void>;

export interface ProxyOptions extends RESTOptions {
	token: string;
}

export const VALID_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

// Should this actually support passing in an existing REST instance?
export function proxyRequests(options: REST | ProxyOptions): RequestHandler {
	const rest = options instanceof REST ? options : new REST(options).setToken(options.token);
	return async (req, res) => {
		const { method, url } = req;

		// These are actual throws since they imply severe miss-use of this middleware function - next() seems unfitting for them
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
				fullRoute: '/',
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

			res.end(discordResponse);
		} catch (error) {
			if (error instanceof DiscordAPIError) {
				res.statusCode = error.status;
				res.statusMessage = error.message;
				res.setHeader('Content-Type', 'application/json');
				res.end(error.rawError);
			}
		}
	};
}
