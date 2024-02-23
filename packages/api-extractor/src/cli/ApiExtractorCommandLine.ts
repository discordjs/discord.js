// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import * as os from 'node:os';
import { InternalError } from '@rushstack/node-core-library';
import { CommandLineParser, type CommandLineFlagParameter } from '@rushstack/ts-command-line';
import colors from 'colors';
import { InitAction } from './InitAction.js';
import { RunAction } from './RunAction.js';

export class ApiExtractorCommandLine extends CommandLineParser {
	private readonly _debugParameter: CommandLineFlagParameter;

	public constructor() {
		super({
			toolFilename: 'api-extractor',
			toolDescription:
				'API Extractor helps you build better TypeScript libraries.  It analyzes the main entry' +
				' point for your package, collects the inventory of exported declarations, and then generates three kinds' +
				' of output:  an API report file (.api.md) to facilitate reviews, a declaration rollup (.d.ts) to be' +
				' published with your NPM package, and a doc model file (.api.json) to be used with a documentation' +
				' tool such as api-documenter.  For details, please visit the web site.',
		});
		this._populateActions();

		this._debugParameter = this.defineFlagParameter({
			parameterLongName: '--debug',
			parameterShortName: '-d',
			description: 'Show the full call stack if an error occurs while executing the tool',
		});
	}

	protected override async onExecute(): Promise<void> {
		// override
		if (this._debugParameter.value) {
			InternalError.breakInDebugger = true;
		}

		try {
			await super.onExecute();
		} catch (error: any) {
			if (this._debugParameter.value) {
				console.error(os.EOL + error.stack);
			} else {
				console.error(os.EOL + colors.red('ERROR: ' + error.message.trim()));
			}

			// eslint-disable-next-line no-restricted-globals
			process.exitCode = 1;
		}
	}

	private _populateActions(): void {
		this.addAction(new InitAction(this));
		this.addAction(new RunAction(this));
	}
}
