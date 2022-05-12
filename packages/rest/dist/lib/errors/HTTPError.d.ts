import type { RequestBody } from './DiscordAPIError';
import type { InternalRequest } from '../RequestManager';
/**
 * Represents a HTTP error
 */
export declare class HTTPError extends Error {
    name: string;
    status: number;
    method: string;
    url: string;
    requestBody: RequestBody;
    /**
     * @param message The error message
     * @param name The name of the error
     * @param status The status code of the response
     * @param method The method of the request that erred
     * @param url The url of the request that erred
     * @param bodyData The unparsed data for the request that errored
     */
    constructor(message: string, name: string, status: number, method: string, url: string, bodyData: Pick<InternalRequest, 'files' | 'body'>);
}
