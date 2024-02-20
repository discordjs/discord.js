// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import { StringBuilder, type IStringBuilder } from '@rushstack/node-core-library';

/**
 * A utility for writing indented text.
 *
 * @remarks
 *
 * Note that the indentation is inserted at the last possible opportunity.
 * For example, this code...
 *
 * ```ts
 *   writer.write('begin\n');
 *   writer.increaseIndent();
 *   writer.write('one\ntwo\n');
 *   writer.decreaseIndent();
 *   writer.increaseIndent();
 *   writer.decreaseIndent();
 *   writer.write('end');
 * ```
 *
 * ...would produce this output:
 *
 * ```
 *   begin
 *     one
 *     two
 *   end
 * ```
 */
export class IndentedWriter {
	/**
	 * The text characters used to create one level of indentation.
	 * Two spaces by default.
	 */
	public defaultIndentPrefix: string = '    ';

	/**
	 * Whether to indent blank lines
	 */
	public indentBlankLines: boolean = false;

	/**
	 * Trims leading spaces from the input text before applying the indent.
	 *
	 * @remarks
	 * Consider the following example:
	 *
	 * ```ts
	 * indentedWriter.increaseIndent('    '); // four spaces
	 * indentedWriter.write('  a\n  b  c\n');
	 * indentedWriter.decreaseIndent();
	 * ```
	 *
	 * Normally the output would be indented by 6 spaces: 4 from `increaseIndent()`, plus the 2 spaces
	 * from `write()`:
	 * ```
	 *       a
	 *       b  c
	 * ```
	 *
	 * Setting `trimLeadingSpaces=true` will trim the leading spaces, so that the lines are indented
	 * by 4 spaces only:
	 * ```
	 *     a
	 *     b  c
	 * ```
	 */
	public trimLeadingSpaces: boolean = false;

	private readonly _builder: IStringBuilder;

	private _latestChunk: string | undefined;

	private _previousChunk: string | undefined;

	private _atStartOfLine: boolean;

	private readonly _indentStack: string[];

	private _indentText: string;

	private _previousLineIsBlank: boolean;

	private _currentLineIsBlank: boolean;

	public constructor(builder?: IStringBuilder) {
		this._builder = builder ?? new StringBuilder();
		this._latestChunk = undefined;
		this._previousChunk = undefined;
		this._atStartOfLine = true;
		this._previousLineIsBlank = true;
		this._currentLineIsBlank = true;

		this._indentStack = [];
		this._indentText = '';
	}

	/**
	 * Retrieves the output that was built so far.
	 */
	public getText(): string {
		return this._builder.toString();
	}

	public toString(): string {
		return this.getText();
	}

	/**
	 * Increases the indentation.  Normally the indentation is two spaces,
	 * however an arbitrary prefix can optional be specified.  (For example,
	 * the prefix could be "// " to indent and comment simultaneously.)
	 * Each call to IndentedWriter.increaseIndent() must be followed by a
	 * corresponding call to IndentedWriter.decreaseIndent().
	 */
	public increaseIndent(indentPrefix?: string): void {
		this._indentStack.push(indentPrefix ?? this.defaultIndentPrefix);
		this._updateIndentText();
	}

	/**
	 * Decreases the indentation, reverting the effect of the corresponding call
	 * to IndentedWriter.increaseIndent().
	 */
	public decreaseIndent(): void {
		this._indentStack.pop();
		this._updateIndentText();
	}

	/**
	 * A shorthand for ensuring that increaseIndent()/decreaseIndent() occur
	 * in pairs.
	 */
	public indentScope(scope: () => void, indentPrefix?: string): void {
		this.increaseIndent(indentPrefix);
		scope();
		this.decreaseIndent();
	}

	/**
	 * Adds a newline if the file pointer is not already at the start of the line (or start of the stream).
	 */
	public ensureNewLine(): void {
		const lastCharacter: string = this.peekLastCharacter();
		if (lastCharacter !== '\n' && lastCharacter !== '') {
			this._writeNewLine();
		}
	}

	/**
	 * Adds up to two newlines to ensure that there is a blank line above the current position.
	 * The start of the stream is considered to be a blank line, so `ensureSkippedLine()` has no effect
	 * unless some text has been written.
	 */
	public ensureSkippedLine(): void {
		this.ensureNewLine();
		if (!this._previousLineIsBlank) {
			this._writeNewLine();
		}
	}

	/**
	 * Returns the last character that was written, or an empty string if no characters have been written yet.
	 */
	public peekLastCharacter(): string {
		if (this._latestChunk !== undefined) {
			return this._latestChunk.slice(-1, -1 + 1);
		}

		return '';
	}

	/**
	 * Returns the second to last character that was written, or an empty string if less than one characters
	 * have been written yet.
	 */
	public peekSecondLastCharacter(): string {
		if (this._latestChunk !== undefined) {
			if (this._latestChunk.length > 1) {
				return this._latestChunk.slice(-2, -2 + 1);
			}

			if (this._previousChunk !== undefined) {
				return this._previousChunk.slice(-1, -1 + 1);
			}
		}

		return '';
	}

	/**
	 * Writes some text to the internal string buffer, applying indentation according
	 * to the current indentation level.  If the string contains multiple newlines,
	 * each line will be indented separately.
	 */
	public write(message: string): void {
		if (message.length === 0) {
			return;
		}

		// If there are no newline characters, then append the string verbatim
		if (!/[\n\r]/.test(message)) {
			this._writeLinePart(message);
			return;
		}

		// Otherwise split the lines and write each one individually
		let first = true;
		for (const linePart of message.split('\n')) {
			if (first) {
				first = false;
			} else {
				this._writeNewLine();
			}

			if (linePart) {
				this._writeLinePart(linePart.replaceAll('\r', ''));
			}
		}
	}

	/**
	 * A shorthand for writing an optional message, followed by a newline.
	 * Indentation is applied following the semantics of IndentedWriter.write().
	 */
	public writeLine(message: string = ''): void {
		if (message.length > 0) {
			this.write(message);
		}

		this._writeNewLine();
	}

	/**
	 * Writes a string that does not contain any newline characters.
	 */
	private _writeLinePart(message: string): void {
		let trimmedMessage: string = message;

		if (this.trimLeadingSpaces && this._atStartOfLine) {
			trimmedMessage = message.replace(/^ +/, '');
		}

		if (trimmedMessage.length > 0) {
			if (this._atStartOfLine && this._indentText.length > 0) {
				this._write(this._indentText);
			}

			this._write(trimmedMessage);
			if (this._currentLineIsBlank && /\S/.test(trimmedMessage)) {
				this._currentLineIsBlank = false;
			}

			this._atStartOfLine = false;
		}
	}

	private _writeNewLine(): void {
		if (this.indentBlankLines && this._atStartOfLine && this._indentText.length > 0) {
			this._write(this._indentText);
		}

		this._previousLineIsBlank = this._currentLineIsBlank;
		this._write('\n');
		this._currentLineIsBlank = true;
		this._atStartOfLine = true;
	}

	private _write(str: string): void {
		this._previousChunk = this._latestChunk;
		this._latestChunk = str;
		this._builder.append(str);
	}

	private _updateIndentText(): void {
		this._indentText = this._indentStack.join('');
	}
}
