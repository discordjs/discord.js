import type { InternalRequest } from '../utils/types.js';
import type { RequestBody } from './DiscordAPIError.js';

/**
 * Represents a HTTP error
 */
export class HTTPError extends Error {
	public requestBody: RequestBody;

	public override name = HTTPError.name;

	/**
	 * @param status - The status code of the response
	 * @param statusText - The status text of the response
	 * @param method - The method of the request that errored
	 * @param url - The url of the request that errored
	 * @param bodyData - The unparsed data for the request that errored
	 */
	public constructor(
		public status: number,
		statusText: string,
		public method: string,
		public url: string,
		bodyData: Pick<InternalRequest, 'body' | 'files'>,
	) {
		super(statusText);
		this.requestBody = { files: bodyData.files, json: bodyData.body };
	}
}
