import type { RESTAPIAttachment } from 'discord-api-types/v10';
import type { RawFile } from './RawFile.js';

/**
 * Represents an object capable of representing itself as a JSON object
 *
 * @typeParam Value - The JSON type corresponding to {@link JSONEncodable.toJSON} outputs.
 */
export interface JSONEncodable<Value> {
	/**
	 * Transforms this object to its JSON format
	 */
	toJSON(): Value;
}

/**
 * Indicates if an object is encodable or not.
 *
 * @param maybeEncodable - The object to check against
 */
export function isJSONEncodable(maybeEncodable: unknown): maybeEncodable is JSONEncodable<unknown> {
	return maybeEncodable !== null && typeof maybeEncodable === 'object' && 'toJSON' in maybeEncodable;
}

/**
 * Result of encoding an object that includes file attachments
 *
 * @typeParam BodyValue - The JSON body type
 */
export interface FileBodyEncodableResult<BodyValue> {
	/**
	 * The JSON body to send with the request
	 */
	body: BodyValue;
	/**
	 * The files to attach to the request
	 */
	files: RawFile[];
}

/**
 * Represents an object capable of representing itself as a request body with file attachments.
 * Objects implementing this interface can separate JSON body data from binary file data,
 * which is necessary for multipart/form-data requests.
 *
 * @typeParam BodyValue - The JSON body type
 */
export interface FileBodyEncodable<BodyValue> {
	/**
	 * Transforms this object to its file body format, separating the JSON body from file attachments.
	 */
	toFileBody(): FileBodyEncodableResult<BodyValue>;
}

/**
 * Indicates if an object is file body encodable or not.
 *
 * @param maybeEncodable - The object to check against
 */
export function isFileBodyEncodable(maybeEncodable: unknown): maybeEncodable is FileBodyEncodable<unknown> {
	return maybeEncodable !== null && typeof maybeEncodable === 'object' && 'toFileBody' in maybeEncodable;
}

/**
 * Represents an object capable of representing itself as a raw file attachment.
 * Objects implementing this interface can return binary file data to be sent as part of
 * mutipart/form-data requests.
 */
export interface RawFileEncodable extends JSONEncodable<RESTAPIAttachment> {
	/**
	 * Returns the raw file of an attachment.
	 */
	getRawFile(): Partial<RawFile> | undefined;
}

/**
 * Indicates if an object is raw file encodable or not.
 *
 * @param maybeEncodable - The object to check against
 */
export function isRawFileEncodable(maybeEncodable: unknown): maybeEncodable is RawFileEncodable {
	return isJSONEncodable(maybeEncodable) && 'getRawFile' in maybeEncodable;
}
