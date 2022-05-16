import { DiscordAPIError, RequestMethod, REST, RouteLike } from '@discordjs/rest';
import { populateErrorResponse, populateOkResponse } from '../util/responseHelpers';
import type { RequestHandler } from '../util/util';

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

		const url = rawUrl.replace(/^\/api(\/v\d+)?/, '') as RouteLike;

		try {
			const discordResponse = await rest.raw({
				body: req,
				fullRoute: url,
				// This type cast is technically incorrect, but we want Discord to throw Method Not Allowed for us
				method: method as RequestMethod,
				passThroughBody: true,
			});

			await populateOkResponse(res, discordResponse);
			res.end();
		} catch (error) {
			if (!(error instanceof DiscordAPIError)) {
				// Unclear if there's better course of action here. Any web framework allows to pass in an error handler for something like this
				// at which point the user could dictate what to do with the error - otherwise we could just 500
				throw error;
			}

			populateErrorResponse(res, error);
			res.end();
		}
	};
}
