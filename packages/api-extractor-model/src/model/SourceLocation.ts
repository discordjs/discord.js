// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

/**
 * Constructor options for `SourceLocation`.
 *
 * @public
 */
export interface ISourceLocationOptions {
	/**
	 * The file URL path relative to the `projectFolder` and `projectFolderURL` fields as
	 * defined in the `api-extractor.json` config.
	 */
	fileUrlPath?: string | undefined;

	/**
	 * The project folder URL as defined by the `api-extractor.json` config `projectFolderUrl`
	 * setting.
	 */
	projectFolderUrl?: string | undefined;

	/**
	 * The column number in the source file. The first column number is 1.
	 */
	sourceFileColumn?: number | undefined;

	/**
	 * The line number in the source file. The first line number is 1.
	 */
	sourceFileLine?: number | undefined;
}

/**
 * The source location where a given API item is declared.
 *
 * @remarks
 * The source location points to the `.ts` source file where the API item was originally
 * declared. However, in some cases, if source map resolution fails, it falls back to pointing
 * to the `.d.ts` file instead.
 * @public
 */
export class SourceLocation {
	readonly #projectFolderUrl?: string | undefined;

	readonly #fileUrlPath?: string | undefined;

	readonly #fileLine?: number | undefined;

	readonly #fileColumn?: number | undefined;

	public constructor(options: ISourceLocationOptions) {
		this.#projectFolderUrl = options.projectFolderUrl;
		this.#fileUrlPath = options.fileUrlPath;
		this.#fileLine = options.sourceFileLine;
		this.#fileColumn = options.sourceFileColumn;
	}

	/**
	 * Returns the file URL to the given source location. Returns `undefined` if the file URL
	 * cannot be determined.
	 */
	public get fileUrl(): string | undefined {
		if (this.#projectFolderUrl === undefined || this.#fileUrlPath === undefined) {
			return undefined;
		}

		let projectFolderUrl: string = this.#projectFolderUrl;
		if (!projectFolderUrl.endsWith('/')) {
			projectFolderUrl += '/';
		}

		const url: URL = new URL(this.#fileUrlPath, projectFolderUrl);
		return url.href;
	}

	/**
	 * The line in the `fileUrlPath` where the API item is declared.
	 */
	public get fileLine(): number | undefined {
		return this.#fileLine;
	}

	/**
	 * The column in the `fileUrlPath` where the API item is declared.
	 */
	public get fileColumn(): number | undefined {
		return this.#fileColumn;
	}
}
