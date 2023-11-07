// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

/**
 * API Extractor helps with validation, documentation, and reviewing of the exported API for a TypeScript library.
 * The `@discordjs/api-extractor` package provides the command-line tool.  It also exposes a developer API that you
 * can use to invoke API Extractor programmatically.
 *
 * @packageDocumentation
 */

export { ConsoleMessageId } from './api/ConsoleMessageId.js';

export { CompilerState, type ICompilerStateCreateOptions } from './api/CompilerState.js';

export { Extractor, type IExtractorInvokeOptions, ExtractorResult } from './api/Extractor.js';

export {
	type IExtractorConfigPrepareOptions,
	type IExtractorConfigLoadForFolderOptions,
	ExtractorConfig,
} from './api/ExtractorConfig.js';

export { ExtractorLogLevel } from './api/ExtractorLogLevel.js';

export {
	ExtractorMessage,
	type IExtractorMessageProperties,
	ExtractorMessageCategory,
} from './api/ExtractorMessage.js';

export { ExtractorMessageId } from './api/ExtractorMessageId.js';

export type {
	IConfigCompiler,
	IConfigApiReport,
	IConfigDocModel,
	IConfigDtsRollup,
	IConfigTsdocMetadata,
	IConfigMessageReportingRule,
	IConfigMessageReportingTable,
	IExtractorMessagesConfig,
	IConfigFile,
} from './api/IConfigFile.js';
