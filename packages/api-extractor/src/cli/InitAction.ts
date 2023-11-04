// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import * as path from 'node:path';
import { FileSystem } from '@rushstack/node-core-library';
import { CommandLineAction } from '@rushstack/ts-command-line';
import colors from 'colors';
import { ExtractorConfig } from '../api/ExtractorConfig.js';
import type { ApiExtractorCommandLine } from './ApiExtractorCommandLine.js';

export class InitAction extends CommandLineAction {
	public constructor(_parser: ApiExtractorCommandLine) {
		super({
			actionName: 'init',
			summary: `Create an ${ExtractorConfig.FILENAME} config file`,
			documentation:
				`Use this command when setting up API Extractor for a new project.  It writes an` +
				` ${ExtractorConfig.FILENAME} config file template with code comments that describe all the settings.` +
				` The file will be written in the current directory.`,
		});
	}

	protected async onExecute(): Promise<void> {
		// override
		const inputFilePath: string = path.resolve(__dirname, './schemas/api-extractor-template.json');
		const outputFilePath: string = path.resolve(ExtractorConfig.FILENAME);

		if (FileSystem.exists(outputFilePath)) {
			console.log(colors.red('The output file already exists:'));
			console.log('\n  ' + outputFilePath + '\n');
			throw new Error('Unable to write output file');
		}

		console.log(colors.green('Writing file: ') + outputFilePath);
		FileSystem.copyFile({
			sourcePath: inputFilePath,
			destinationPath: outputFilePath,
		});

		console.log(
			'\nThe recommended location for this file is in the project\'s "config" subfolder,\n' +
				'or else in the top-level folder with package.json.',
		);
	}
}
