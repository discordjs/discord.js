// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import type * as tsdoc from '@microsoft/tsdoc';
import { Sort, InternalError } from '@rushstack/node-core-library';
import colors from 'colors';
import * as ts from 'typescript';
import { AstDeclaration } from '../analyzer/AstDeclaration.js';
import type { AstSymbol } from '../analyzer/AstSymbol.js';
import { ConsoleMessageId } from '../api/ConsoleMessageId.js';
import { ExtractorLogLevel } from '../api/ExtractorLogLevel.js';
import {
	ExtractorMessage,
	ExtractorMessageCategory,
	type IExtractorMessageOptions,
	type IExtractorMessageProperties,
} from '../api/ExtractorMessage.js';
import { type ExtractorMessageId, allExtractorMessageIds } from '../api/ExtractorMessageId.js';
import type { IExtractorMessagesConfig, IConfigMessageReportingRule } from '../api/IConfigFile.js';
import type { ISourceLocation, SourceMapper } from './SourceMapper.js';

interface IReportingRule {
	addToApiReportFile: boolean;
	logLevel: ExtractorLogLevel;
}

export interface IMessageRouterOptions {
	messageCallback: ((message: ExtractorMessage) => void) | undefined;
	messagesConfig: IExtractorMessagesConfig;
	showDiagnostics: boolean;
	showVerboseMessages: boolean;
	sourceMapper: SourceMapper;
	tsdocConfiguration: tsdoc.TSDocConfiguration;
	workingPackageFolder: string | undefined;
}

export interface IBuildJsonDumpObjectOptions {
	/**
	 * {@link MessageRouter.buildJsonDumpObject} will omit any objects keys with these names.
	 */
	keyNamesToOmit?: string[];
}

export class MessageRouter {
	public static readonly DIAGNOSTICS_LINE: string = '============================================================';

	private readonly _workingPackageFolder: string | undefined;

	private readonly _messageCallback: ((message: ExtractorMessage) => void) | undefined;

	// All messages
	private readonly _messages: ExtractorMessage[];

	// For each AstDeclaration, the messages associated with it.  This is used when addToApiReportFile=true
	private readonly _associatedMessagesForAstDeclaration: Map<AstDeclaration, ExtractorMessage[]>;

	private readonly _sourceMapper: SourceMapper;

	private readonly _tsdocConfiguration: tsdoc.TSDocConfiguration;

	// Normalized representation of the routing rules from api-extractor.json
	private _reportingRuleByMessageId: Map<string, IReportingRule> = new Map<string, IReportingRule>();

	private _compilerDefaultRule: IReportingRule = {
		logLevel: ExtractorLogLevel.None,
		addToApiReportFile: false,
	};

	private _extractorDefaultRule: IReportingRule = {
		logLevel: ExtractorLogLevel.None,
		addToApiReportFile: false,
	};

	private _tsdocDefaultRule: IReportingRule = { logLevel: ExtractorLogLevel.None, addToApiReportFile: false };

	public errorCount: number = 0;

	public warningCount: number = 0;

	/**
	 * See {@link IExtractorInvokeOptions.showVerboseMessages}
	 */
	public readonly showVerboseMessages: boolean;

	/**
	 * See {@link IExtractorInvokeOptions.showDiagnostics}
	 */
	public readonly showDiagnostics: boolean;

	public constructor(options: IMessageRouterOptions) {
		this._workingPackageFolder = options.workingPackageFolder;
		this._messageCallback = options.messageCallback;

		this._messages = [];
		this._associatedMessagesForAstDeclaration = new Map<AstDeclaration, ExtractorMessage[]>();
		this._sourceMapper = options.sourceMapper;
		this._tsdocConfiguration = options.tsdocConfiguration;

		// showDiagnostics implies showVerboseMessages
		this.showVerboseMessages = options.showVerboseMessages || options.showDiagnostics;
		this.showDiagnostics = options.showDiagnostics;

		this._applyMessagesConfig(options.messagesConfig);
	}

	/**
	 * Read the api-extractor.json configuration and build up the tables of routing rules.
	 */
	private _applyMessagesConfig(messagesConfig: IExtractorMessagesConfig): void {
		if (messagesConfig.compilerMessageReporting) {
			for (const messageId of Object.getOwnPropertyNames(messagesConfig.compilerMessageReporting)) {
				const reportingRule: IReportingRule = MessageRouter._getNormalizedRule(
					messagesConfig.compilerMessageReporting[messageId]!,
				);

				if (messageId === 'default') {
					this._compilerDefaultRule = reportingRule;
				} else if (/^TS\d+$/.test(messageId)) {
					this._reportingRuleByMessageId.set(messageId, reportingRule);
				} else {
					throw new Error(
						`Error in API Extractor config: The messages.compilerMessageReporting table contains` +
							` an invalid entry "${messageId}". The identifier format is "TS" followed by an integer.`,
					);
				}
			}
		}

		if (messagesConfig.extractorMessageReporting) {
			for (const messageId of Object.getOwnPropertyNames(messagesConfig.extractorMessageReporting)) {
				const reportingRule: IReportingRule = MessageRouter._getNormalizedRule(
					messagesConfig.extractorMessageReporting[messageId]!,
				);

				if (messageId === 'default') {
					this._extractorDefaultRule = reportingRule;
				} else if (!messageId.startsWith('ae-')) {
					throw new Error(
						`Error in API Extractor config: The messages.extractorMessageReporting table contains` +
							` an invalid entry "${messageId}".  The name should begin with the "ae-" prefix.`,
					);
				} else if (allExtractorMessageIds.has(messageId)) {
					this._reportingRuleByMessageId.set(messageId, reportingRule);
				} else {
					throw new Error(
						`Error in API Extractor config: The messages.extractorMessageReporting table contains` +
							` an unrecognized identifier "${messageId}".  Is it spelled correctly?`,
					);
				}
			}
		}

		if (messagesConfig.tsdocMessageReporting) {
			for (const messageId of Object.getOwnPropertyNames(messagesConfig.tsdocMessageReporting)) {
				const reportingRule: IReportingRule = MessageRouter._getNormalizedRule(
					messagesConfig.tsdocMessageReporting[messageId]!,
				);

				if (messageId === 'default') {
					this._tsdocDefaultRule = reportingRule;
				} else if (!messageId.startsWith('tsdoc-')) {
					throw new Error(
						`Error in API Extractor config: The messages.tsdocMessageReporting table contains` +
							` an invalid entry "${messageId}".  The name should begin with the "tsdoc-" prefix.`,
					);
				} else if (this._tsdocConfiguration.isKnownMessageId(messageId)) {
					this._reportingRuleByMessageId.set(messageId, reportingRule);
				} else {
					throw new Error(
						`Error in API Extractor config: The messages.tsdocMessageReporting table contains` +
							` an unrecognized identifier "${messageId}".  Is it spelled correctly?`,
					);
				}
			}
		}
	}

	private static _getNormalizedRule(rule: IConfigMessageReportingRule): IReportingRule {
		return {
			logLevel: rule.logLevel || 'none',
			addToApiReportFile: rule.addToApiReportFile ?? false,
		};
	}

	public get messages(): readonly ExtractorMessage[] {
		return this._messages;
	}

	/**
	 * Add a diagnostic message reported by the TypeScript compiler
	 */
	public addCompilerDiagnostic(diagnostic: ts.Diagnostic): void {
		switch (diagnostic.category) {
			case ts.DiagnosticCategory.Suggestion:
			case ts.DiagnosticCategory.Message:
				return; // ignore noise
			default:
				break;
		}

		const messageText: string = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
		const options: IExtractorMessageOptions = {
			category: ExtractorMessageCategory.Compiler,
			messageId: `TS${diagnostic.code}`,
			text: messageText,
		};

		if (diagnostic.file) {
			// NOTE: Since compiler errors pertain to issues specific to the .d.ts files,
			// we do not apply source mappings for them.
			const sourceFile: ts.SourceFile = diagnostic.file;
			const sourceLocation: ISourceLocation = this._sourceMapper.getSourceLocation({
				sourceFile,
				pos: diagnostic.start ?? 0,
				useDtsLocation: true,
			});
			options.sourceFilePath = sourceLocation.sourceFilePath;
			options.sourceFileLine = sourceLocation.sourceFileLine;
			options.sourceFileColumn = sourceLocation.sourceFileColumn;
		}

		this._messages.push(new ExtractorMessage(options));
	}

	/**
	 * Add a message from the API Extractor analysis
	 */
	public addAnalyzerIssue(
		messageId: ExtractorMessageId,
		messageText: string,
		astDeclarationOrSymbol: AstDeclaration | AstSymbol,
		properties?: IExtractorMessageProperties,
	): void {
		let astDeclaration: AstDeclaration;
		if (astDeclarationOrSymbol instanceof AstDeclaration) {
			astDeclaration = astDeclarationOrSymbol;
		} else {
			astDeclaration = astDeclarationOrSymbol.astDeclarations[0]!;
		}

		const extractorMessage: ExtractorMessage = this.addAnalyzerIssueForPosition(
			messageId,
			messageText,
			astDeclaration.declaration.getSourceFile(),
			astDeclaration.declaration.getStart(),
			properties,
		);

		this._associateMessageWithAstDeclaration(extractorMessage, astDeclaration);
	}

	/**
	 * Add all messages produced from an invocation of the TSDoc parser, assuming they refer to
	 * code in the specified source file.
	 */
	public addTsdocMessages(
		parserContext: tsdoc.ParserContext,
		sourceFile: ts.SourceFile,
		astDeclaration?: AstDeclaration,
	): void {
		for (const message of parserContext.log.messages) {
			const options: IExtractorMessageOptions = {
				category: ExtractorMessageCategory.TSDoc,
				messageId: message.messageId,
				text: message.unformattedText,
			};

			const sourceLocation: ISourceLocation = this._sourceMapper.getSourceLocation({
				sourceFile,
				pos: message.textRange.pos,
			});
			options.sourceFilePath = sourceLocation.sourceFilePath;
			options.sourceFileLine = sourceLocation.sourceFileLine;
			options.sourceFileColumn = sourceLocation.sourceFileColumn;

			const extractorMessage: ExtractorMessage = new ExtractorMessage(options);

			if (astDeclaration) {
				this._associateMessageWithAstDeclaration(extractorMessage, astDeclaration);
			}

			this._messages.push(extractorMessage);
		}
	}

	/**
	 * Recursively collects the primitive members (numbers, strings, arrays, etc) into an object that
	 * is JSON serializable.  This is used by the "--diagnostics" feature to dump the state of configuration objects.
	 *
	 * @returns a JSON serializable object (possibly including `null` values)
	 *          or `undefined` if the input cannot be represented as JSON
	 */

	public static buildJsonDumpObject(input: any, options?: IBuildJsonDumpObjectOptions): any | undefined {
		const ioptions = options ?? {};

		const keyNamesToOmit: Set<string> = new Set(ioptions.keyNamesToOmit);

		return MessageRouter._buildJsonDumpObject(input, keyNamesToOmit);
	}

	private static _buildJsonDumpObject(input: any, keyNamesToOmit: Set<string>): any | undefined {
		if (input === null || input === undefined) {
			return null; // JSON uses null instead of undefined
		}

		switch (typeof input) {
			case 'boolean':
			case 'number':
			case 'string':
				return input;
			case 'object':
				if (Array.isArray(input)) {
					const outputArray: any[] = [];
					for (const element of input) {
						const serializedElement: any = MessageRouter._buildJsonDumpObject(element, keyNamesToOmit);
						if (serializedElement !== undefined) {
							outputArray.push(serializedElement);
						}
					}

					return outputArray;
				}

				// eslint-disable-next-line no-case-declarations
				const outputObject: object = {};
				for (const key of Object.getOwnPropertyNames(input)) {
					if (keyNamesToOmit.has(key)) {
						continue;
					}

					const value: any = input[key];

					const serializedValue: any = MessageRouter._buildJsonDumpObject(value, keyNamesToOmit);

					if (serializedValue !== undefined) {
						(outputObject as any)[key] = serializedValue;
					}
				}

				return outputObject;
			default:
				return undefined;
		}
	}

	/**
	 * Record this message in  _associatedMessagesForAstDeclaration
	 */
	private _associateMessageWithAstDeclaration(
		extractorMessage: ExtractorMessage,
		astDeclaration: AstDeclaration,
	): void {
		let associatedMessages: ExtractorMessage[] | undefined =
			this._associatedMessagesForAstDeclaration.get(astDeclaration);

		if (!associatedMessages) {
			associatedMessages = [];
			this._associatedMessagesForAstDeclaration.set(astDeclaration, associatedMessages);
		}

		associatedMessages.push(extractorMessage);
	}

	/**
	 * Add a message for a location in an arbitrary source file.
	 */
	public addAnalyzerIssueForPosition(
		messageId: ExtractorMessageId,
		messageText: string,
		sourceFile: ts.SourceFile,
		pos: number,
		properties?: IExtractorMessageProperties,
	): ExtractorMessage {
		const options: IExtractorMessageOptions = {
			category: ExtractorMessageCategory.Extractor,
			messageId,
			text: messageText,
			properties,
		};

		const sourceLocation: ISourceLocation = this._sourceMapper.getSourceLocation({
			sourceFile,
			pos,
		});
		options.sourceFilePath = sourceLocation.sourceFilePath;
		options.sourceFileLine = sourceLocation.sourceFileLine;
		options.sourceFileColumn = sourceLocation.sourceFileColumn;

		const extractorMessage: ExtractorMessage = new ExtractorMessage(options);

		this._messages.push(extractorMessage);
		return extractorMessage;
	}

	/**
	 * This is used when writing the API report file.  It looks up any messages that were configured to get emitted
	 * in the API report file and returns them.  It also records that they were emitted, which suppresses them from
	 * being shown on the console.
	 */
	public fetchAssociatedMessagesForReviewFile(astDeclaration: AstDeclaration): ExtractorMessage[] {
		const messagesForApiReportFile: ExtractorMessage[] = [];

		const associatedMessages: ExtractorMessage[] = this._associatedMessagesForAstDeclaration.get(astDeclaration) ?? [];
		for (const associatedMessage of associatedMessages) {
			// Make sure we didn't already report this message for some reason
			if (!associatedMessage.handled) {
				// Is this message type configured to go in the API report file?
				const reportingRule: IReportingRule = this._getRuleForMessage(associatedMessage);
				if (reportingRule.addToApiReportFile) {
					// Include it in the result, and record that it went to the API report file
					messagesForApiReportFile.push(associatedMessage);
					associatedMessage.handled = true;
				}
			}
		}

		this._sortMessagesForOutput(messagesForApiReportFile);
		return messagesForApiReportFile;
	}

	/**
	 * This returns all remaining messages that were flagged with `addToApiReportFile`, but which were not
	 * retreieved using `fetchAssociatedMessagesForReviewFile()`.
	 */
	public fetchUnassociatedMessagesForReviewFile(): ExtractorMessage[] {
		const messagesForApiReportFile: ExtractorMessage[] = [];

		for (const unassociatedMessage of this.messages) {
			// Make sure we didn't already report this message for some reason
			if (!unassociatedMessage.handled) {
				// Is this message type configured to go in the API report file?
				const reportingRule: IReportingRule = this._getRuleForMessage(unassociatedMessage);
				if (reportingRule.addToApiReportFile) {
					// Include it in the result, and record that it went to the API report file
					messagesForApiReportFile.push(unassociatedMessage);
					unassociatedMessage.handled = true;
				}
			}
		}

		this._sortMessagesForOutput(messagesForApiReportFile);
		return messagesForApiReportFile;
	}

	/**
	 * This returns the list of remaining messages that were not already processed by
	 * `fetchAssociatedMessagesForReviewFile()` or `fetchUnassociatedMessagesForReviewFile()`.
	 * These messages will be shown on the console.
	 */
	public handleRemainingNonConsoleMessages(): void {
		const messagesForLogger: ExtractorMessage[] = [];

		for (const message of this.messages) {
			// Make sure we didn't already report this message
			if (!message.handled) {
				messagesForLogger.push(message);
			}
		}

		this._sortMessagesForOutput(messagesForLogger);

		for (const message of messagesForLogger) {
			this._handleMessage(message);
		}
	}

	public logError(messageId: ConsoleMessageId, message: string, properties?: IExtractorMessageProperties): void {
		this._handleMessage(
			new ExtractorMessage({
				category: ExtractorMessageCategory.Console,
				messageId,
				text: message,
				properties,
				logLevel: ExtractorLogLevel.Error,
			}),
		);
	}

	public logWarning(messageId: ConsoleMessageId, message: string, properties?: IExtractorMessageProperties): void {
		this._handleMessage(
			new ExtractorMessage({
				category: ExtractorMessageCategory.Console,
				messageId,
				text: message,
				properties,
				logLevel: ExtractorLogLevel.Warning,
			}),
		);
	}

	public logInfo(messageId: ConsoleMessageId, message: string, properties?: IExtractorMessageProperties): void {
		this._handleMessage(
			new ExtractorMessage({
				category: ExtractorMessageCategory.Console,
				messageId,
				text: message,
				properties,
				logLevel: ExtractorLogLevel.Info,
			}),
		);
	}

	public logVerbose(messageId: ConsoleMessageId, message: string, properties?: IExtractorMessageProperties): void {
		this._handleMessage(
			new ExtractorMessage({
				category: ExtractorMessageCategory.Console,
				messageId,
				text: message,
				properties,
				logLevel: ExtractorLogLevel.Verbose,
			}),
		);
	}

	public logDiagnosticHeader(title: string): void {
		this.logDiagnostic(MessageRouter.DIAGNOSTICS_LINE);
		this.logDiagnostic(`DIAGNOSTIC: ` + title);
		this.logDiagnostic(MessageRouter.DIAGNOSTICS_LINE);
	}

	public logDiagnosticFooter(): void {
		this.logDiagnostic(MessageRouter.DIAGNOSTICS_LINE + '\n');
	}

	public logDiagnostic(message: string): void {
		if (this.showDiagnostics) {
			this.logVerbose(ConsoleMessageId.Diagnostics, message);
		}
	}

	/**
	 * Give the calling application a chance to handle the `ExtractorMessage`, and if not, display it on the console.
	 */
	private _handleMessage(message: ExtractorMessage): void {
		// Don't tally messages that were already "handled" by writing them into the API report
		if (message.handled) {
			return;
		}

		// Assign the ExtractorMessage.logLevel; the message callback may adjust it below
		if (message.category === ExtractorMessageCategory.Console) {
			// Console messages have their category log level assigned via logInfo(), logVerbose(), etc.
		} else {
			const reportingRule: IReportingRule = this._getRuleForMessage(message);
			message.logLevel = reportingRule.logLevel;
		}

		// If there is a callback, allow it to modify and/or handle the message
		if (this._messageCallback) {
			this._messageCallback(message);
		}

		// Update the statistics
		switch (message.logLevel) {
			case ExtractorLogLevel.Error:
				++this.errorCount;
				break;
			case ExtractorLogLevel.Warning:
				++this.warningCount;
				break;
			default:
				break;
		}

		if (message.handled) {
			return;
		}

		// The messageCallback did not handle the message, so perform default handling
		message.handled = true;

		if (message.logLevel === ExtractorLogLevel.None) {
			return;
		}

		let messageText: string;
		if (message.category === ExtractorMessageCategory.Console) {
			messageText = message.text;
		} else {
			messageText = message.formatMessageWithLocation(this._workingPackageFolder);
		}

		switch (message.logLevel) {
			case ExtractorLogLevel.Error:
				console.error(colors.red('Error: ' + messageText));
				break;
			case ExtractorLogLevel.Warning:
				console.warn(colors.yellow('Warning: ' + messageText));
				break;
			case ExtractorLogLevel.Info:
				console.log(messageText);
				break;
			case ExtractorLogLevel.Verbose:
				if (this.showVerboseMessages) {
					console.log(colors.cyan(messageText));
				}

				break;
			default:
				throw new Error(`Invalid logLevel value: ${JSON.stringify(message.logLevel)}`);
		}
	}

	/**
	 * For a given message, determine the IReportingRule based on the rule tables.
	 */
	private _getRuleForMessage(message: ExtractorMessage): IReportingRule {
		const reportingRule: IReportingRule | undefined = this._reportingRuleByMessageId.get(message.messageId);
		if (reportingRule) {
			return reportingRule;
		}

		switch (message.category) {
			case ExtractorMessageCategory.Compiler:
				return this._compilerDefaultRule;
			case ExtractorMessageCategory.Extractor:
				return this._extractorDefaultRule;
			case ExtractorMessageCategory.TSDoc:
				return this._tsdocDefaultRule;
			case ExtractorMessageCategory.Console:
				throw new InternalError('ExtractorMessageCategory.Console is not supported with IReportingRule');
		}
	}

	/**
	 * Sorts an array of messages according to a reasonable ordering
	 */
	private _sortMessagesForOutput(messages: ExtractorMessage[]): void {
		messages.sort((a, b) => {
			let diff: number;
			// First sort by file name
			diff = Sort.compareByValue(a.sourceFilePath, b.sourceFilePath);
			if (diff !== 0) {
				return diff;
			}

			// Then sort by line number
			diff = Sort.compareByValue(a.sourceFileLine, b.sourceFileLine);
			if (diff !== 0) {
				return diff;
			}

			// Then sort by messageId
			return Sort.compareByValue(a.messageId, b.messageId);
		});
	}
}
