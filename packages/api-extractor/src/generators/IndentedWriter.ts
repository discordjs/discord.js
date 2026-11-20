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

	readonly #builder: IStringBuilder;

	#latestChunk: string | undefined;

	#previousChunk: string | undefined;

	#atStartOfLine: boolean;

	readonly #indentStack: string[];

	#indentText: string;

	#previousLineIsBlank: boolean;

	#currentLineIsBlank: boolean;

	public constructor(builder?: IStringBuilder) {
		this.#builder = builder ?? new StringBuilder();
		this.#latestChunk = undefined;
		this.#previousChunk = undefined;
		this.#atStartOfLine = true;
		this.#previousLineIsBlank = true;
		this.#currentLineIsBlank = true;

		this.#indentStack = [];
		this.#indentText = '';
	}

	/**
	 * Retrieves the output that was built so far.
	 */
	public getText(): string {
		return this.#builder.toString();
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
		this.#indentStack.push(indentPrefix ?? this.defaultIndentPrefix);
		this.#updateIndentText();
	}

	/**
	 * Decreases the indentation, reverting the effect of the corresponding call
	 * to IndentedWriter.increaseIndent().
	 */
	public decreaseIndent(): void {
		this.#indentStack.pop();
		this.#updateIndentText();
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
			this.#writeNewLine();
		}
	}

	/**
	 * Adds up to two newlines to ensure that there is a blank line above the current position.
	 * The start of the stream is considered to be a blank line, so `ensureSkippedLine()` has no effect
	 * unless some text has been written.
	 */
	public ensureSkippedLine(): void {
		this.ensureNewLine();
		if (!this.#previousLineIsBlank) {
			this.#writeNewLine();
		}
	}

	/**
	 * Returns the last character that was written, or an empty string if no characters have been written yet.
	 */
	public peekLastCharacter(): string {
		if (this.#latestChunk !== undefined) {
			return this.#latestChunk.slice(-1, -1 + 1);
		}

		return '';
	}

	/**
	 * Returns the second to last character that was written, or an empty string if less than one characters
	 * have been written yet.
	 */
	public peekSecondLastCharacter(): string {
		if (this.#latestChunk !== undefined) {
			if (this.#latestChunk.length > 1) {
				return this.#latestChunk.slice(-2, -2 + 1);
			}

			if (this.#previousChunk !== undefined) {
				return this.#previousChunk.slice(-1, -1 + 1);
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
			this.#writeLinePart(message);
			return;
		}

		// Otherwise split the lines and write each one individually
		let first = true;
		for (const linePart of message.split('\n')) {
			if (first) {
				first = false;
			} else {
				this.#writeNewLine();
			}

			if (linePart) {
				this.#writeLinePart(linePart.replaceAll('\r', ''));
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

		this.#writeNewLine();
	}

	/**
	 * Writes a string that does not contain any newline characters.
	 */
	#writeLinePart(message: string): void {
		let trimmedMessage: string = message;

		if (this.trimLeadingSpaces && this.#atStartOfLine) {
			trimmedMessage = message.replace(/^ +/, '');
		}

		if (trimmedMessage.length > 0) {
			if (this.#atStartOfLine && this.#indentText.length > 0) {
				this.#write(this.#indentText);
			}

			this.#write(trimmedMessage);
			if (this.#currentLineIsBlank && /\S/.test(trimmedMessage)) {
				this.#currentLineIsBlank = false;
			}

			this.#atStartOfLine = false;
		}
	}

	#writeNewLine(): void {
		if (this.indentBlankLines && this.#atStartOfLine && this.#indentText.length > 0) {
			this.#write(this.#indentText);
		}

		this.#previousLineIsBlank = this.#currentLineIsBlank;
		this.#write('\n');
		this.#currentLineIsBlank = true;
		this.#atStartOfLine = true;
	}

	#write(str: string): void {
		this.#previousChunk = this.#latestChunk;
		this.#latestChunk = str;
		this.#builder.append(str);
	}

	#updateIndentText(): void {
		this.#indentText = this.#indentStack.join('');
	}
}
