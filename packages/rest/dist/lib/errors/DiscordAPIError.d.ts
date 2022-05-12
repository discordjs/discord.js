import type { InternalRequest, RawFile } from '../RequestManager';
interface DiscordErrorFieldInformation {
    code: string;
    message: string;
}
interface DiscordErrorGroupWrapper {
    _errors: DiscordError[];
}
declare type DiscordError = DiscordErrorGroupWrapper | DiscordErrorFieldInformation | {
    [k: string]: DiscordError;
} | string;
export interface DiscordErrorData {
    code: number;
    message: string;
    errors?: DiscordError;
}
export interface OAuthErrorData {
    error: string;
    error_description?: string;
}
export interface RequestBody {
    files: RawFile[] | undefined;
    json: unknown | undefined;
}
/**
 * Represents an API error returned by Discord
 * @extends Error
 */
export declare class DiscordAPIError extends Error {
    rawError: DiscordErrorData | OAuthErrorData;
    code: number | string;
    status: number;
    method: string;
    url: string;
    requestBody: RequestBody;
    /**
     * @param rawError The error reported by Discord
     * @param code The error code reported by Discord
     * @param status The status code of the response
     * @param method The method of the request that erred
     * @param url The url of the request that erred
     * @param bodyData The unparsed data for the request that errored
     */
    constructor(rawError: DiscordErrorData | OAuthErrorData, code: number | string, status: number, method: string, url: string, bodyData: Pick<InternalRequest, 'files' | 'body'>);
    /**
     * The name of the error
     */
    get name(): string;
    private static getMessage;
    private static flattenDiscordError;
}
export {};
