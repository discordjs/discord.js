// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import * as os from 'node:os';
import process from 'node:process';
import { Colorize } from '@rushstack/terminal';
import { Extractor } from './api/Extractor.js';
import { ApiExtractorCommandLine } from './cli/ApiExtractorCommandLine.js';

console.log(
	os.EOL +
		Colorize.bold(`api-extractor ${Extractor.version} ` + Colorize.cyan(' - https://api-extractor.com/') + os.EOL),
);

const parser: ApiExtractorCommandLine = new ApiExtractorCommandLine();

// eslint-disable-next-line promise/prefer-await-to-callbacks
parser.executeAsync().catch((error) => {
	console.error(Colorize.red(`An unexpected error occurred:`), error);
	process.exit(1);
});
