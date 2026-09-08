// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import * as os from 'node:os';
import * as path from 'node:path';
import process from 'node:process';
import {
	PackageJsonLookup,
	FileSystem,
	type IPackageJson,
	Path,
	AlreadyReportedError,
} from '@rushstack/node-core-library';
import {
	CommandLineAction,
	type CommandLineStringParameter,
	type CommandLineFlagParameter,
} from '@rushstack/ts-command-line';
import colors from 'colors';
import { Extractor, type ExtractorResult } from '../api/Extractor.js';
import { ExtractorConfig, type IExtractorConfigPrepareOptions } from '../api/ExtractorConfig.js';
import type { ApiExtractorCommandLine } from './ApiExtractorCommandLine.js';

export class RunAction extends CommandLineAction {
	private readonly _configFileParameter: CommandLineStringParameter;

	private readonly _localFlag: CommandLineFlagParameter;

	private readonly _verboseFlag: CommandLineFlagParameter;

	private readonly _diagnosticsParameter: CommandLineFlagParameter;

	private readonly _typescriptCompilerFolderParameter: CommandLineStringParameter;

	private readonly _minify: CommandLineFlagParameter;

	private readonly _printApiReportDiffFlag: CommandLineFlagParameter;

	public constructor(_parser: ApiExtractorCommandLine) {
		super({
			actionName: 'run',
			summary: 'Invoke API Extractor on a project',
			documentation: 'Invoke API Extractor on a project',
		});

		this._configFileParameter = this.defineStringParameter({
			parameterLongName: '--config',
			parameterShortName: '-c',
			argumentName: 'FILE',
			description: `Use the specified ${ExtractorConfig.FILENAME} file path, rather than guessing its location`,
		});

		this._localFlag = this.defineFlagParameter({
			parameterLongName: '--local',
			parameterShortName: '-l',
			description:
				'Indicates that API Extractor is running as part of a local build,' +
				" e.g. on a developer's machine. This disables certain validation that would" +
				' normally be performed for a ship/production build. For example, the *.api.md' +
				' report file is automatically copied in a local build.',
		});

		this._verboseFlag = this.defineFlagParameter({
			parameterLongName: '--verbose',
			parameterShortName: '-v',
			description: 'Show additional informational messages in the output.',
		});

		this._minify = this.defineFlagParameter({
			parameterLongName: '--minify',
			parameterShortName: '-m',
			description: 'Minify the resulting doc model JSON, i.e. without any indentation or newlines.',
		});

		this._diagnosticsParameter = this.defineFlagParameter({
			parameterLongName: '--diagnostics',
			description:
				'Show diagnostic messages used for troubleshooting problems with API Extractor.' +
				'  This flag also enables the "--verbose" flag.',
		});

		this._typescriptCompilerFolderParameter = this.defineStringParameter({
			parameterLongName: '--typescript-compiler-folder',
			argumentName: 'PATH',
			description:
				'API Extractor uses its own TypeScript compiler engine to analyze your project.  If your project' +
				' is built with a significantly different TypeScript version, sometimes API Extractor may report compilation' +
				' errors due to differences in the system typings (e.g. lib.dom.d.ts).  You can use the' +
				' "--typescriptCompilerFolder" option to specify the folder path where you installed the TypeScript package,' +
				" and API Extractor's compiler will use those system typings instead.",
		});

		this._printApiReportDiffFlag = this.defineFlagParameter({
			parameterLongName: '--print-api-report-diff',
			description:
				'If provided, then any differences between the actual and expected API reports will be ' +
				'printed on the console. Note that the diff is not printed if the expected API report file has not been ' +
				'created yet.',
		});
	}

	protected override async onExecuteAsync(): Promise<void> {
		const lookup: PackageJsonLookup = new PackageJsonLookup();
		let configFilename: string;

		let typescriptCompilerFolder: string | undefined = this._typescriptCompilerFolderParameter.value;
		if (typescriptCompilerFolder) {
			typescriptCompilerFolder = path.normalize(typescriptCompilerFolder);

			if (FileSystem.exists(typescriptCompilerFolder)) {
				typescriptCompilerFolder = lookup.tryGetPackageFolderFor(typescriptCompilerFolder);
				const typescriptCompilerPackageJson: IPackageJson | undefined = typescriptCompilerFolder
					? lookup.tryLoadPackageJsonFor(typescriptCompilerFolder)
					: undefined;
				if (!typescriptCompilerPackageJson) {
					throw new Error(
						`The path specified in the ${this._typescriptCompilerFolderParameter.longName} parameter is not a package.`,
					);
				} else if (typescriptCompilerPackageJson.name !== 'typescript') {
					throw new Error(
						`The path specified in the ${this._typescriptCompilerFolderParameter.longName} parameter is not a TypeScript` +
							' compiler package.',
					);
				}
			} else {
				throw new Error(
					`The path specified in the ${this._typescriptCompilerFolderParameter.longName} parameter does not exist.`,
				);
			}
		}

		let extractorConfig: ExtractorConfig;

		if (this._configFileParameter.value) {
			configFilename = path.normalize(this._configFileParameter.value);
			if (!FileSystem.exists(configFilename)) {
				throw new Error('Config file not found: ' + this._configFileParameter.value);
			}

			extractorConfig = ExtractorConfig.loadFileAndPrepare(configFilename);
		} else {
			const prepareOptions: IExtractorConfigPrepareOptions | undefined = ExtractorConfig.tryLoadForFolder({
				startingFolder: '.',
			});

			if (!prepareOptions?.configObjectFullPath) {
				throw new Error(`Unable to find an ${ExtractorConfig.FILENAME} file`);
			}

			const configObjectShortPath: string = Path.formatConcisely({
				pathToConvert: prepareOptions.configObjectFullPath,
				baseFolder: process.cwd(),
			});
			console.log(`Using configuration from ${configObjectShortPath}`);

			extractorConfig = ExtractorConfig.prepare(prepareOptions);
		}

		const extractorResult: ExtractorResult = Extractor.invoke(extractorConfig, {
			localBuild: this._localFlag.value,
			docModelMinify: this._minify.value,
			showVerboseMessages: this._verboseFlag.value,
			showDiagnostics: this._diagnosticsParameter.value,
			typescriptCompilerFolder,
			printApiReportDiff: this._printApiReportDiffFlag.value,
		});

		if (extractorResult.succeeded) {
			console.log(os.EOL + 'API Extractor completed successfully');
		} else {
			if (extractorResult.errorCount > 0) {
				console.log(os.EOL + colors.red('API Extractor completed with errors'));
			} else {
				console.log(os.EOL + colors.yellow('API Extractor completed with warnings'));
			}

			throw new AlreadyReportedError();
		}
	}
}
