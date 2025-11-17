import type { Buffer } from 'node:buffer';

/**
 * Represents a file to be added to a request with multipart/form-data encoding
 */
export interface RawFile {
	/**
	 * Content-Type of the file.
	 * If not provided, it will be inferred from the file data when possible
	 *
	 * @example 'image/png'
	 * @example 'application/pdf'
	 */
	contentType?: string;
	/**
	 * The actual data for the file
	 */
	data: Buffer | Uint8Array | boolean | number | string;
	/**
	 * An explicit key to use for the formdata field for this file.
	 * When not provided, the index of the file in the files array is used in the form `files[${index}]`.
	 * If you wish to alter the placeholder snowflake, you must provide this property in the same form (`files[${placeholder}]`)
	 */
	key?: string;
	/**
	 * The name of the file. This is the actual filename that will be used when uploading to Discord.
	 * This is also the name you'll use to reference the file with attachment:// URLs.
	 *
	 * @example 'image.png'
	 * @example 'document.pdf'
	 * @example 'SPOILER_secret.jpeg'
	 */
	name: string;
}
