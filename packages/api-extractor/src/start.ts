// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import * as os from 'node:os';
import * as process from 'node:process';
import colors from 'colors';
import { Extractor } from './api/Extractor.js';
import { ApiExtractorCommandLine } from './cli/ApiExtractorCommandLine.js';

console.log(
	os.EOL + colors.bold(`api-extractor ${Extractor.version} ` + colors.cyan(' - https://api-extractor.com/') + os.EOL),
);

const parser: ApiExtractorCommandLine = new ApiExtractorCommandLine();

// eslint-disable-next-line promise/prefer-await-to-callbacks
parser.execute().catch((error) => {
	console.error(colors.red(`An unexpected error occurred:`), error);
	process.exit(1);
});
