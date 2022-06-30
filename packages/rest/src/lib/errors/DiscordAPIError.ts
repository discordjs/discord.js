import type { InternalRequest, RawFile } from '../RequestManager';

interface DiscordErrorFieldInformation {
	code: string;
	message: string;
}

interface DiscordErrorGroupWrapper {
	_errors: DiscordError[];
}

type DiscordError = DiscordErrorGroupWrapper | DiscordErrorFieldInformation | { [k: string]: DiscordError } | string;

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

function isErrorGroupWrapper(error: DiscordError): error is DiscordErrorGroupWrapper {
	return Reflect.has(error as Record<string, unknown>, '_errors');
}

function isErrorResponse(error: DiscordError): error is DiscordErrorFieldInformation {
	return typeof Reflect.get(error as Record<string, unknown>, 'message') === 'string';
}

/**
 * Represents an API error returned by Discord
 * @extends Error
 */
export class DiscordAPIError extends Error {
	public requestBody: RequestBody;

	/**
	 * @param rawError - The error reported by Discord
	 * @param code - The error code reported by Discord
	 * @param status - The status code of the response
	 * @param method - The method of the request that erred
	 * @param url - The url of the request that erred
	 * @param bodyData - The unparsed data for the request that errored
	 */
	public constructor(
		public rawError: DiscordErrorData | OAuthErrorData,
		public code: number | string,
		public status: number,
		public method: string,
		public url: string,
		bodyData: Pick<InternalRequest, 'files' | 'body'>,
	) {
		super(DiscordAPIError.getMessage(rawError));

		this.requestBody = { files: bodyData.files, json: bodyData.body };
	}

	/**
	 * The name of the error
	 */
	public override get name(): string {
		return `${DiscordAPIError.name}[${this.code}]`;
	}

	private static getMessage(error: DiscordErrorData | OAuthErrorData) {
		let flattened = '';
		if ('code' in error) {
			if (error.errors) {
				flattened = [...this.flattenDiscordError(error.errors)].join('\n');
			}
			return error.message && flattened
				? `${error.message}\n${flattened}`
				: error.message || flattened || 'Unknown Error';
		}
		return error.error_description ?? 'No Description';
	}

	private static *flattenDiscordError(obj: DiscordError, key = ''): IterableIterator<string> {
		if (isErrorResponse(obj)) {
			return yield `${key.length ? `${key}[${obj.code}]` : `${obj.code}`}: ${obj.message}`.trim();
		}

		for (const [k, v] of Object.entries(obj)) {
			const nextKey = k.startsWith('_') ? key : key ? (Number.isNaN(Number(k)) ? `${key}.${k}` : `${key}[${k}]`) : k;

			if (typeof v === 'string') {
				yield v;
				// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
			} else if (isErrorGroupWrapper(v)) {
				for (const error of v._errors) {
					yield* this.flattenDiscordError(error, nextKey);
				}
			} else {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
				yield* this.flattenDiscordError(v, nextKey);
			}
		}
	}
}
