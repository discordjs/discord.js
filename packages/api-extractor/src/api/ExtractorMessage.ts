// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import type * as tsdoc from '@microsoft/tsdoc';
import { SourceFileLocationFormatter } from '../analyzer/SourceFileLocationFormatter.js';
import type { ConsoleMessageId } from './ConsoleMessageId.js';
import { ExtractorLogLevel } from './ExtractorLogLevel.js';
import type { ExtractorMessageId } from './ExtractorMessageId.js';

/**
 * Used by {@link ExtractorMessage.properties}.
 *
 * @public
 */
export interface IExtractorMessageProperties {
	/**
	 * A declaration can have multiple names if it is exported more than once.
	 * If an `ExtractorMessage` applies to a specific export name, this property can indicate that.
	 *
	 * @remarks
	 *
	 * Used by {@link ExtractorMessageId.InternalMissingUnderscore}.
	 */
	readonly exportName?: string;
}

/**
 * Specifies a category of messages for use with {@link ExtractorMessage}.
 *
 * @public
 */
export const enum ExtractorMessageCategory {
	/**
	 * Messages originating from the TypeScript compiler.
	 *
	 * @remarks
	 * These strings begin with the prefix "TS" and have a numeric error code.
	 * Example: `TS2551`
	 */
	Compiler = 'Compiler',

	/**
	 * Console messages communicate the progress of the overall operation.  They may include newlines to ensure
	 * nice formatting.  They are output in real time, and cannot be routed to the API Report file.
	 *
	 * @remarks
	 * These strings begin with the prefix "console-".
	 * Example: `console-writing-typings-file`
	 */
	Console = 'console',

	/**
	 * Messages related to API Extractor's analysis.
	 *
	 * @remarks
	 * These strings begin with the prefix "ae-".
	 * Example: `ae-extra-release-tag`
	 */
	Extractor = 'Extractor',

	/**
	 * Messages related to parsing of TSDoc comments.
	 *
	 * @remarks
	 * These strings begin with the prefix "tsdoc-".
	 * Example: `tsdoc-link-tag-unescaped-text`
	 */
	TSDoc = 'TSDoc',
}

/**
 * Constructor options for `ExtractorMessage`.
 */
export interface IExtractorMessageOptions {
	category: ExtractorMessageCategory;
	logLevel?: ExtractorLogLevel;
	messageId: ConsoleMessageId | ExtractorMessageId | tsdoc.TSDocMessageId | string;
	properties?: IExtractorMessageProperties | undefined;
	sourceFileColumn?: number;
	sourceFileLine?: number;
	sourceFilePath?: string;
	text: string;
}

/**
 * This object is used to report an error or warning that occurred during API Extractor's analysis.
 *
 * @public
 */
export class ExtractorMessage {
	private _handled: boolean;

	private _logLevel: ExtractorLogLevel;

	/**
	 * The category of issue.
	 */
	public readonly category: ExtractorMessageCategory;

	/**
	 * A text string that uniquely identifies the issue type.  This identifier can be used to suppress
	 * or configure the reporting of issues, and also to search for help about an issue.
	 */
	public readonly messageId: ConsoleMessageId | ExtractorMessageId | tsdoc.TSDocMessageId | string;

	/**
	 * The text description of this issue.
	 */
	public readonly text: string;

	/**
	 * The absolute path to the affected input source file, if there is one.
	 */
	public readonly sourceFilePath: string | undefined;

	/**
	 * The line number where the issue occurred in the input source file.  This is not used if `sourceFilePath`
	 * is undefined.  The first line number is 1.
	 */
	public readonly sourceFileLine: number | undefined;

	/**
	 * The column number where the issue occurred in the input source file.  This is not used if `sourceFilePath`
	 * is undefined.  The first column number is 1.
	 */
	public readonly sourceFileColumn: number | undefined;

	/**
	 * Additional contextual information about the message that may be useful when reporting errors.
	 * All properties are optional.
	 */
	public readonly properties: IExtractorMessageProperties;

	/**
	 * @internal
	 */
	public constructor(options: IExtractorMessageOptions) {
		this.category = options.category;
		this.messageId = options.messageId;
		this.text = options.text;
		this.sourceFilePath = options.sourceFilePath;
		this.sourceFileLine = options.sourceFileLine;
		this.sourceFileColumn = options.sourceFileColumn;
		this.properties = options.properties ?? {};

		this._handled = false;
		this._logLevel = options.logLevel ?? ExtractorLogLevel.None;
	}

	/**
	 * If the {@link IExtractorInvokeOptions.messageCallback} sets this property to true, it will prevent the message
	 * from being displayed by API Extractor.
	 *
	 * @remarks
	 * If the `messageCallback` routes the message to a custom handler (e.g. a toolchain logger), it should
	 * assign `handled = true` to prevent API Extractor from displaying it.  Assigning `handled = true` for all messages
	 * would effectively disable all console output from the `Extractor` API.
	 *
	 * If `handled` is set to true, the message will still be included in the count of errors/warnings;
	 * to discard a message entirely, instead assign `logLevel = none`.
	 */
	public get handled(): boolean {
		return this._handled;
	}

	public set handled(value: boolean) {
		if (this._handled && !value) {
			throw new Error('One a message has been marked as handled, the "handled" property cannot be set to false');
		}

		this._handled = value;
	}

	/**
	 * Specifies how the message should be reported.
	 *
	 * @remarks
	 * If the {@link IExtractorInvokeOptions.messageCallback} handles the message (i.e. sets `handled = true`),
	 * it can use the `logLevel` to determine how to display the message.
	 *
	 * Alternatively, if API Extractor is handling the message, the `messageCallback` could assign `logLevel` to change
	 * how it will be processed.  However, in general the recommended practice is to configure message routing
	 * using the `messages` section in api-extractor.json.
	 *
	 * To discard a message entirely, assign `logLevel = none`.
	 */
	public get logLevel(): ExtractorLogLevel {
		return this._logLevel;
	}

	public set logLevel(value: ExtractorLogLevel) {
		switch (value) {
			case ExtractorLogLevel.Error:
			case ExtractorLogLevel.Info:
			case ExtractorLogLevel.None:
			case ExtractorLogLevel.Verbose:
			case ExtractorLogLevel.Warning:
				break;
			default:
				throw new Error('Invalid log level');
		}

		this._logLevel = value;
	}

	/**
	 * Returns the message formatted with its identifier and file position.
	 *
	 * @remarks
	 * Example:
	 * ```
	 * src/folder/File.ts:123:4 - (ae-extra-release-tag) The doc comment should not contain more than one release tag.
	 * ```
	 */
	public formatMessageWithLocation(workingPackageFolderPath: string | undefined): string {
		let result = '';

		if (this.sourceFilePath) {
			result += SourceFileLocationFormatter.formatPath(this.sourceFilePath, {
				sourceFileLine: this.sourceFileLine,
				sourceFileColumn: this.sourceFileColumn,
				workingPackageFolderPath,
			});

			if (result.length > 0) {
				result += ' - ';
			}
		}

		result += this.formatMessageWithoutLocation();

		return result;
	}

	public formatMessageWithoutLocation(): string {
		return `(${this.messageId}) ${this.text}`;
	}
}
