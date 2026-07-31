// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import * as path from 'node:path';
import type { ApiPackage } from '@discordjs/api-extractor-model';
import { TSDocConfigFile } from '@microsoft/tsdoc-config';
import {
	FileSystem,
	NewlineKind,
	PackageJsonLookup,
	type IPackageJson,
	type INodePackageJson,
	Path,
} from '@rushstack/node-core-library';
import { structuredPatch, formatPatch, type StructuredPatch } from 'diff';
import * as resolve from 'resolve';
import * as semver from 'semver';
import * as ts from 'typescript';
import { PackageMetadataManager } from '../analyzer/PackageMetadataManager.js';
import { Collector } from '../collector/Collector.js';
import { MessageRouter } from '../collector/MessageRouter.js';
import { SourceMapper } from '../collector/SourceMapper.js';
import { DocCommentEnhancer } from '../enhancers/DocCommentEnhancer.js';
import { ValidationEnhancer } from '../enhancers/ValidationEnhancer.js';
import { ApiModelGenerator } from '../generators/ApiModelGenerator.js';
import { ApiReportGenerator } from '../generators/ApiReportGenerator.js';
import { DtsRollupGenerator, DtsRollupKind } from '../generators/DtsRollupGenerator.js';
import { CompilerState } from './CompilerState.js';
import { ConsoleMessageId } from './ConsoleMessageId.js';
import { ExtractorConfig, type IExtractorConfigApiReport } from './ExtractorConfig.js';
import type { ExtractorMessage } from './ExtractorMessage.js';

/**
 * Runtime options for Extractor.
 *
 * @public
 */
export interface IExtractorInvokeOptions {
	/**
	 * An optional TypeScript compiler state.  This allows an optimization where multiple invocations of API Extractor
	 * can reuse the same TypeScript compiler analysis.
	 */
	compilerState?: CompilerState;

	/**
	 * Whether to minify the resulting doc model JSON, i.e. without any indentation or newlines.
	 */
	docModelMinify?: boolean;

	/**
	 * Indicates that API Extractor is running as part of a local build, e.g. on developer's
	 * machine.
	 *
	 * @remarks
	 * This disables certain validation that would normally be performed for a ship/production build. For example,
	 * the *.api.md report file is automatically updated in a local build.
	 *
	 * The default value is false.
	 */
	localBuild?: boolean;

	/**
	 * An optional callback function that will be called for each `ExtractorMessage` before it is displayed by
	 * API Extractor.  The callback can customize the message, handle it, or discard it.
	 *
	 * @remarks
	 * If a `messageCallback` is not provided, then by default API Extractor will print the messages to
	 * the STDERR/STDOUT console.
	 */
	messageCallback?(this: void, message: ExtractorMessage): void;

	/**
	 * If true, then any differences between the actual and expected API reports will be
	 * printed on the console.
	 *
	 * @remarks
	 * The diff is not printed if the expected API report file has not been created yet.
	 */
	printApiReportDiff?: boolean;

	/**
	 * If true, API Extractor will print diagnostic information used for troubleshooting problems.
	 * These messages will be included as {@link ExtractorLogLevel.Verbose} output.
	 *
	 * @remarks
	 * Setting `showDiagnostics=true` forces `showVerboseMessages=true`.
	 */
	showDiagnostics?: boolean;

	/**
	 * If true, API Extractor will include {@link ExtractorLogLevel.Verbose} messages in its output.
	 */
	showVerboseMessages?: boolean;

	/**
	 * Specifies an alternate folder path to be used when loading the TypeScript system typings.
	 *
	 * @remarks
	 * API Extractor uses its own TypeScript compiler engine to analyze your project.  If your project
	 * is built with a significantly different TypeScript version, sometimes API Extractor may report compilation
	 * errors due to differences in the system typings (e.g. lib.dom.d.ts).  You can use the "--typescriptCompilerFolder"
	 * option to specify the folder path where you installed the TypeScript package, and API Extractor's compiler will
	 * use those system typings instead.
	 */
	typescriptCompilerFolder?: string | undefined;
}

/**
 * This object represents the outcome of an invocation of API Extractor.
 *
 * @public
 */
export class ExtractorResult {
	/**
	 * The TypeScript compiler state that was used.
	 */
	public readonly compilerState: CompilerState;

	/**
	 * The API Extractor configuration that was used.
	 */
	public readonly extractorConfig: ExtractorConfig;

	/**
	 * Whether the invocation of API Extractor was successful.  For example, if `succeeded` is false, then the build task
	 * would normally return a nonzero process exit code, indicating that the operation failed.
	 *
	 * @remarks
	 *
	 * Normally the operation "succeeds" if `errorCount` and `warningCount` are both zero.  However if
	 * {@link IExtractorInvokeOptions.localBuild} is `true`, then the operation "succeeds" if `errorCount` is zero
	 * (i.e. warnings are ignored).
	 */
	public readonly succeeded: boolean;

	/**
	 * Returns true if the API report was found to have changed.
	 */
	public readonly apiReportChanged: boolean;

	/**
	 * Reports the number of errors encountered during analysis.
	 *
	 * @remarks
	 * This does not count exceptions, where unexpected issues prematurely abort the operation.
	 */
	public readonly errorCount: number;

	/**
	 * Reports the number of warnings encountered during analysis.
	 *
	 * @remarks
	 * This does not count warnings that are emitted in the API report file.
	 */
	public readonly warningCount: number;

	/**
	 * @internal
	 */
	public constructor(properties: ExtractorResult) {
		const { compilerState, extractorConfig, succeeded, apiReportChanged, errorCount, warningCount } = properties;
		this.compilerState = compilerState;
		this.extractorConfig = extractorConfig;
		this.succeeded = succeeded;
		this.apiReportChanged = apiReportChanged;
		this.errorCount = errorCount;
		this.warningCount = warningCount;
	}
}

/**
 * The starting point for invoking the API Extractor tool.
 *
 * @public
 */
export class Extractor {
	/**
	 * Returns the version number of the API Extractor NPM package.
	 */
	public static get version(): string {
		return Extractor._getPackageJson().version;
	}

	/**
	 * Returns the package name of the API Extractor NPM package.
	 */
	public static get packageName(): string {
		return Extractor._getPackageJson().name;
	}

	private static _getPackageJson(): IPackageJson {
		return PackageJsonLookup.loadOwnPackageJson(__dirname);
	}

	/**
	 * Load the api-extractor.json config file from the specified path, and then invoke API Extractor.
	 */
	public static loadConfigAndInvoke(configFilePath: string, options?: IExtractorInvokeOptions): ExtractorResult {
		const extractorConfig: ExtractorConfig = ExtractorConfig.loadFileAndPrepare(configFilePath);

		return Extractor.invoke(extractorConfig, options);
	}

	/**
	 * Invoke API Extractor using an already prepared `ExtractorConfig` object.
	 */
	public static invoke(extractorConfig: ExtractorConfig, options?: IExtractorInvokeOptions): ExtractorResult {
		const {
			packageFolder,
			messages,
			tsdocConfiguration,
			tsdocConfigFile: { filePath: tsdocConfigFilePath, fileNotFound: tsdocConfigFileNotFound },
			apiJsonFilePath,
			newlineKind,
			reportTempFolder,
			reportFolder,
			apiReportEnabled,
			reportConfigs,
			testMode,
			rollupEnabled,
			publicTrimmedFilePath,
			alphaTrimmedFilePath,
			betaTrimmedFilePath,
			untrimmedFilePath,
			tsdocMetadataEnabled,
			tsdocMetadataFilePath,
		} = extractorConfig;
		const {
			localBuild = false,
			compilerState = CompilerState.create(extractorConfig, options),
			docModelMinify = false,
			messageCallback,
			showVerboseMessages = false,
			showDiagnostics = false,
			printApiReportDiff = false,
		} = options ?? {};

		const sourceMapper: SourceMapper = new SourceMapper();

		const messageRouter: MessageRouter = new MessageRouter({
			workingPackageFolder: packageFolder,
			messageCallback,
			messagesConfig: messages || {},
			showVerboseMessages,
			showDiagnostics,
			tsdocConfiguration,
			sourceMapper,
		});

		if (
			tsdocConfigFilePath &&
			!tsdocConfigFileNotFound &&
			!Path.isEqual(tsdocConfigFilePath, ExtractorConfig._tsdocBaseFilePath)
		) {
			messageRouter.logVerbose(
				ConsoleMessageId.UsingCustomTSDocConfig,
				`Using custom TSDoc config from ${tsdocConfigFilePath}`,
			);
		}

		this._checkCompilerCompatibility(extractorConfig, messageRouter);

		if (messageRouter.showDiagnostics) {
			messageRouter.logDiagnostic('');
			messageRouter.logDiagnosticHeader('Final prepared ExtractorConfig');
			messageRouter.logDiagnostic(extractorConfig.getDiagnosticDump());
			messageRouter.logDiagnosticFooter();

			messageRouter.logDiagnosticHeader('Compiler options');
			const serializedCompilerOptions: object = MessageRouter.buildJsonDumpObject(
				(compilerState.program as ts.Program).getCompilerOptions(),
			);
			messageRouter.logDiagnostic(JSON.stringify(serializedCompilerOptions, undefined, 2));
			messageRouter.logDiagnosticFooter();

			messageRouter.logDiagnosticHeader('TSDoc configuration');
			// Convert the TSDocConfiguration into a tsdoc.json representation
			const combinedConfigFile: TSDocConfigFile = TSDocConfigFile.loadFromParser(tsdocConfiguration);
			const serializedTSDocConfig: object = MessageRouter.buildJsonDumpObject(combinedConfigFile.saveToObject());
			messageRouter.logDiagnostic(JSON.stringify(serializedTSDocConfig, undefined, 2));
			messageRouter.logDiagnosticFooter();
		}

		const collector: Collector = new Collector({
			program: compilerState.program as ts.Program,
			messageRouter,
			extractorConfig,
			sourceMapper,
		});

		collector.analyze();

		DocCommentEnhancer.analyze(collector);
		ValidationEnhancer.analyze(collector);

		const modelBuilder: ApiModelGenerator = new ApiModelGenerator(collector, extractorConfig);
		const apiPackage: ApiPackage = modelBuilder.buildApiPackage();

		if (messageRouter.showDiagnostics) {
			messageRouter.logDiagnostic(''); // skip a line after any diagnostic messages
		}

		if (modelBuilder.docModelEnabled) {
			messageRouter.logVerbose(ConsoleMessageId.WritingDocModelFile, `Writing: ${apiJsonFilePath}`);
			apiPackage.saveToJsonFile(apiJsonFilePath, {
				toolPackage: Extractor.packageName,
				toolVersion: Extractor.version,
				minify: docModelMinify,
				newlineConversion: newlineKind,
				ensureFolderExists: true,
				testMode,
			});
		}

		function writeApiReport(reportConfig: IExtractorConfigApiReport): boolean {
			return Extractor._writeApiReport(
				collector,
				extractorConfig,
				messageRouter,
				reportTempFolder,
				reportFolder,
				reportConfig,
				localBuild,
				printApiReportDiff,
			);
		}

		let anyReportChanged = false;
		if (apiReportEnabled) {
			for (const reportConfig of reportConfigs) {
				anyReportChanged = writeApiReport(reportConfig) || anyReportChanged;
			}
		}

		if (rollupEnabled) {
			Extractor._generateRollupDtsFile(collector, publicTrimmedFilePath, DtsRollupKind.PublicRelease, newlineKind);
			Extractor._generateRollupDtsFile(collector, alphaTrimmedFilePath, DtsRollupKind.AlphaRelease, newlineKind);
			Extractor._generateRollupDtsFile(collector, betaTrimmedFilePath, DtsRollupKind.BetaRelease, newlineKind);
			Extractor._generateRollupDtsFile(collector, untrimmedFilePath, DtsRollupKind.InternalRelease, newlineKind);
		}

		if (tsdocMetadataEnabled) {
			// Write the tsdoc-metadata.json file for this project
			PackageMetadataManager.writeTsdocMetadataFile(tsdocMetadataFilePath, newlineKind);
		}

		// Show all the messages that we collected during analysis
		messageRouter.handleRemainingNonConsoleMessages();

		// Determine success
		let succeeded: boolean;
		if (localBuild) {
			// For a local build, fail if there were errors (but ignore warnings)
			succeeded = messageRouter.errorCount === 0;
		} else {
			// For a production build, fail if there were any errors or warnings
			succeeded = messageRouter.errorCount + messageRouter.warningCount === 0;
		}

		return new ExtractorResult({
			compilerState,
			extractorConfig,
			succeeded,
			apiReportChanged: anyReportChanged,
			errorCount: messageRouter.errorCount,
			warningCount: messageRouter.warningCount,
		});
	}

	/**
	 * Generates the API report at the specified release level, writes it to the specified file path, and compares
	 * the output to the existing report (if one exists).
	 *
	 * @param collector - The collector to get the entities from.
	 * @param extractorConfig - The configuration for extracting.
	 * @param messageRouter - The message router to use.
	 * @param reportTempDirectoryPath - The path to the directory under which the temp report file will be written prior
	 * to comparison with an existing report.
	 * @param reportDirectoryPath - The path to the directory under which the existing report file is located, and to
	 * which the new report will be written post-comparison.
	 * @param reportConfig - API report configuration, including its file name and {@link ApiReportVariant}.
	 * @param localBuild - Whether the report is made locally.
	 * @param printApiReportDiff - {@link IExtractorInvokeOptions.printApiReportDiff}
	 * @returns Whether or not the newly generated report differs from the existing report (if one exists).
	 */
	private static _writeApiReport(
		collector: Collector,
		extractorConfig: ExtractorConfig,
		messageRouter: MessageRouter,
		reportTempDirectoryPath: string,
		reportDirectoryPath: string,
		reportConfig: IExtractorConfigApiReport,
		localBuild: boolean,
		printApiReportDiff: boolean,
	): boolean {
		let apiReportChanged = false;

		const actualApiReportPathWithoutExtension: string = path
			.resolve(reportTempDirectoryPath, reportConfig.fileName)
			.replace(/\.api\.md$/, '');

		const expectedApiReportPathWithoutExtension: string = path
			.resolve(reportDirectoryPath, reportConfig.fileName)
			.replace(/\.api\.md$/, '');

		const actualApiReportContentMap: Map<string, string> = ApiReportGenerator.generateReviewFileContent(
			collector,
			reportConfig.variant,
		);

		for (const [modulePath, actualApiReportContent] of actualApiReportContentMap) {
			const actualEntryPointApiReportPath = `${actualApiReportPathWithoutExtension}${
				modulePath ? '.' : ''
			}${modulePath}.api.md`;
			const actualEntryPointApiReportShortPath: string =
				extractorConfig._getShortFilePath(actualEntryPointApiReportPath);
			const expectedEntryPointApiReportPath = `${expectedApiReportPathWithoutExtension}${
				modulePath ? '.' : ''
			}${modulePath}.api.md`;
			const expectedEntryPointApiReportShortPath: string = extractorConfig._getShortFilePath(
				expectedEntryPointApiReportPath,
			);

			collector.messageRouter.logVerbose(
				ConsoleMessageId.WritingApiReport,
				`Generating ${reportConfig.variant} API report: ${expectedEntryPointApiReportPath}`,
			);

			// Write the actual file
			FileSystem.writeFile(actualEntryPointApiReportPath, actualApiReportContent, {
				ensureFolderExists: true,
				convertLineEndings: extractorConfig.newlineKind,
			});

			// Compare it against the expected file
			if (FileSystem.exists(expectedEntryPointApiReportPath)) {
				const expectedApiReportContent: string = FileSystem.readFile(expectedEntryPointApiReportPath, {
					convertLineEndings: NewlineKind.Lf,
				});

				if (ApiReportGenerator.areEquivalentApiFileContents(actualApiReportContent, expectedApiReportContent)) {
					messageRouter.logVerbose(
						ConsoleMessageId.ApiReportUnchanged,
						`The API report is up to date: ${actualEntryPointApiReportShortPath}`,
					);
				} else {
					apiReportChanged = true;

					if (localBuild) {
						// For a local build, just copy the file automatically.
						messageRouter.logWarning(
							ConsoleMessageId.ApiReportCopied,
							`You have changed the API signature for this project. Updating ${actualEntryPointApiReportShortPath}`,
						);

						FileSystem.writeFile(actualEntryPointApiReportPath, actualApiReportContent, {
							ensureFolderExists: true,
							convertLineEndings: extractorConfig.newlineKind,
						});
					} else {
						// For a production build, issue a warning that will break the CI build.
						messageRouter.logWarning(
							ConsoleMessageId.ApiReportNotCopied,
							'You have changed the API signature for this project.' +
								` Please copy the file "${actualEntryPointApiReportShortPath}" to "${expectedEntryPointApiReportShortPath}",` +
								` or perform a local build (which does this automatically).` +
								` See the Git repo documentation for more info.`,
						);
					}

					if (messageRouter.showVerboseMessages || printApiReportDiff) {
						const patch: StructuredPatch = structuredPatch(
							expectedEntryPointApiReportShortPath,
							actualEntryPointApiReportShortPath,
							expectedApiReportContent,
							actualApiReportContent,
						);
						const logFunction:
							| (typeof MessageRouter.prototype)['logVerbose']
							| (typeof MessageRouter.prototype)['logWarning'] = printApiReportDiff
							? messageRouter.logWarning.bind(messageRouter)
							: messageRouter.logVerbose.bind(messageRouter);

						logFunction(ConsoleMessageId.ApiReportDiff, 'Changes to the API report:\n\n' + formatPatch(patch));
					}
				}
			} else {
				// The target file does not exist, so we are setting up the API review file for the first time.
				//
				// NOTE: People sometimes make a mistake where they move a project and forget to update the "reportFolder"
				// setting, which causes a new file to silently get written to the wrong place.  This can be confusing.
				// Thus we treat the initial creation of the file specially.
				apiReportChanged = true;

				if (localBuild) {
					const expectedApiReportFolder: string = path.dirname(expectedEntryPointApiReportPath);
					if (FileSystem.exists(expectedApiReportFolder)) {
						FileSystem.writeFile(expectedEntryPointApiReportPath, actualApiReportContent, {
							convertLineEndings: extractorConfig.newlineKind,
						});
						messageRouter.logWarning(
							ConsoleMessageId.ApiReportCreated,
							'The API report file was missing, so a new file was created. Please add this file to Git:\n' +
								expectedEntryPointApiReportPath,
						);
					} else {
						messageRouter.logError(
							ConsoleMessageId.ApiReportFolderMissing,
							'Unable to create the API report file. Please make sure the target folder exists:\n' +
								expectedApiReportFolder,
						);
					}
				} else {
					// For a production build, issue a warning that will break the CI build.
					messageRouter.logWarning(
						ConsoleMessageId.ApiReportNotCopied,
						'The API report file is missing.' +
							` Please copy the file "${actualEntryPointApiReportShortPath}" to "${expectedEntryPointApiReportShortPath}",` +
							` or perform a local build (which does this automatically).` +
							` See the Git repo documentation for more info.`,
					);
				}
			}
		}

		return apiReportChanged;
	}

	private static _checkCompilerCompatibility(extractorConfig: ExtractorConfig, messageRouter: MessageRouter): void {
		messageRouter.logInfo(ConsoleMessageId.Preamble, `Analysis will use the bundled TypeScript version ${ts.version}`);

		try {
			const typescriptPath: string = resolve.sync('typescript', {
				basedir: extractorConfig.projectFolder,
				preserveSymlinks: false,
			});
			const packageJsonLookup: PackageJsonLookup = new PackageJsonLookup();
			const packageJson: INodePackageJson | undefined = packageJsonLookup.tryLoadNodePackageJsonFor(typescriptPath);
			if (packageJson?.version && semver.valid(packageJson.version)) {
				// Consider a newer MINOR release to be incompatible
				const ourMajor: number = semver.major(ts.version);
				const ourMinor: number = semver.minor(ts.version);

				const theirMajor: number = semver.major(packageJson.version);
				const theirMinor: number = semver.minor(packageJson.version);

				if (theirMajor > ourMajor || (theirMajor === ourMajor && theirMinor > ourMinor)) {
					messageRouter.logInfo(
						ConsoleMessageId.CompilerVersionNotice,
						`*** The target project appears to use TypeScript ${packageJson.version} which is newer than the` +
							` bundled compiler engine; consider upgrading API Extractor.`,
					);
				}
			}
		} catch {
			// The compiler detection heuristic is not expected to work in many configurations
		}
	}

	private static _generateRollupDtsFile(
		collector: Collector,
		outputPath: string,
		dtsKind: DtsRollupKind,
		newlineKind: NewlineKind,
	): void {
		if (outputPath !== '') {
			collector.messageRouter.logVerbose(ConsoleMessageId.WritingDtsRollup, `Writing package typings: ${outputPath}`);
			DtsRollupGenerator.writeTypingsFile(collector, outputPath, dtsKind, newlineKind);
		}
	}
}
