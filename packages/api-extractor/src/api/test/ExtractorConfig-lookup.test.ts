// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import * as path from 'node:path';
import { Path } from '@rushstack/node-core-library';
import { ExtractorConfig } from '../ExtractorConfig.js';

const testDataFolder: string = path.join(__dirname, 'test-data');

function expectEqualPaths(path1: string, path2: string): void {
	if (!Path.isEqual(path1, path2)) {
		fail('Expected paths to be equal:\npath1: ' + path1 + '\npath2: ' + path2);
	}
}

// Tests for expanding the "<lookup>" token for the "projectFolder" setting in api-extractor.json
describe(`${ExtractorConfig.name}.${ExtractorConfig.loadFileAndPrepare.name}`, () => {
	it.only('config-lookup1: looks up ./api-extractor.json', () => {
		const extractorConfig: ExtractorConfig = ExtractorConfig.loadFileAndPrepare(
			path.join(testDataFolder, 'config-lookup1/api-extractor.json'),
		);
		expectEqualPaths(extractorConfig.projectFolder, path.join(testDataFolder, 'config-lookup1'));
	});
	it.only('config-lookup2: looks up ./config/api-extractor.json', () => {
		const extractorConfig: ExtractorConfig = ExtractorConfig.loadFileAndPrepare(
			path.join(testDataFolder, 'config-lookup2/config/api-extractor.json'),
		);
		expectEqualPaths(extractorConfig.projectFolder, path.join(testDataFolder, 'config-lookup2'));
	});
	it.only('config-lookup3a: looks up ./src/test/config/api-extractor.json', () => {
		const extractorConfig: ExtractorConfig = ExtractorConfig.loadFileAndPrepare(
			path.join(testDataFolder, 'config-lookup3/src/test/config/api-extractor.json'),
		);
		expectEqualPaths(extractorConfig.projectFolder, path.join(testDataFolder, 'config-lookup3/src/test/'));
	});
});
