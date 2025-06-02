// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

/**
 * Unique identifiers for console messages reported by API Extractor.
 *
 * @remarks
 *
 * These strings are possible values for the {@link ExtractorMessage.messageId} property
 * when the `ExtractorMessage.category` is {@link ExtractorMessageCategory.Console}.
 * @public
 */
export const enum ConsoleMessageId {
	/**
	 * "You have changed the public API signature for this project.  Updating ___"
	 */
	ApiReportCopied = 'console-api-report-copied',

	/**
	 * "The API report file was missing, so a new file was created. Please add this file to Git: ___"
	 */
	ApiReportCreated = 'console-api-report-created',

	/**
	 * "Unable to create the API report file. Please make sure the target folder exists: ___"
	 */
	ApiReportFolderMissing = 'console-api-report-folder-missing',

	/**
	 * "You have changed the public API signature for this project.
	 * Please copy the file ___ to ___, or perform a local build (which does this automatically).
	 * See the Git repo documentation for more info."
	 *
	 * OR
	 *
	 * "The API report file is missing.
	 * Please copy the file ___ to ___, or perform a local build (which does this automatically).
	 * See the Git repo documentation for more info."
	 */
	ApiReportNotCopied = 'console-api-report-not-copied',

	/**
	 * "The API report is up to date: ___"
	 */
	ApiReportUnchanged = 'console-api-report-unchanged',

	/**
	 * "The target project appears to use TypeScript ___ which is newer than the bundled compiler engine;
	 * consider upgrading API Extractor."
	 */
	CompilerVersionNotice = 'console-compiler-version-notice',

	/**
	 * Used for the information printed when the "--diagnostics" flag is enabled.
	 */
	Diagnostics = 'console-diagnostics',

	/**
	 * "Found metadata in ___"
	 */
	FoundTSDocMetadata = 'console-found-tsdoc-metadata',

	/**
	 * "Analysis will use the bundled TypeScript version ___"
	 */
	Preamble = 'console-preamble',

	/**
	 * "Using custom TSDoc config from ___"
	 */
	UsingCustomTSDocConfig = 'console-using-custom-tsdoc-config',

	/**
	 * "Generating ___ API report: ___"
	 */
	WritingApiReport = 'console-writing-api-report',

	/**
	 * "Writing: ___"
	 */
	WritingDocModelFile = 'console-writing-doc-model-file',

	/**
	 * "Writing package typings: ___"
	 */
	WritingDtsRollup = 'console-writing-dts-rollup',
}
