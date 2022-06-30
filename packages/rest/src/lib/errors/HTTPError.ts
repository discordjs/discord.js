import type { RequestBody } from './DiscordAPIError';
import type { InternalRequest } from '../RequestManager';

/**
 * Represents a HTTP error
 */
export class HTTPError extends Error {
	public requestBody: RequestBody;

	/**
	 * @param name - The name of the error
	 * @param status - The status code of the response
	 * @param method - The method of the request that erred
	 * @param url - The url of the request that erred
	 * @param bodyData - The unparsed data for the request that errored
	 */
	public constructor(
		public override name: string,
		public status: number,
		public method: string,
		public url: string,
		bodyData: Pick<InternalRequest, 'files' | 'body'>,
	) {
		super();

		this.requestBody = { files: bodyData.files, json: bodyData.body };
	}
}
