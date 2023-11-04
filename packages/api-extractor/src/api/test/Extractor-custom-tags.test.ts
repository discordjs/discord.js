// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import * as path from 'node:path';
import { StandardTags } from '@microsoft/tsdoc';
import { ExtractorConfig } from '../ExtractorConfig.js';

const testDataFolder: string = path.join(__dirname, 'test-data');

describe('Extractor-custom-tags', () => {
	describe('should use a TSDocConfiguration', () => {
		it.only("with custom TSDoc tags defined in the package's tsdoc.json", () => {
			const extractorConfig: ExtractorConfig = ExtractorConfig.loadFileAndPrepare(
				path.join(testDataFolder, 'custom-tsdoc-tags/api-extractor.json'),
			);
			const { tsdocConfiguration } = extractorConfig;

			expect(tsdocConfiguration.tryGetTagDefinition('@block')).not.toBe(undefined);
			expect(tsdocConfiguration.tryGetTagDefinition('@inline')).not.toBe(undefined);
			expect(tsdocConfiguration.tryGetTagDefinition('@modifier')).not.toBe(undefined);
		});
		it.only("with custom TSDoc tags enabled per the package's tsdoc.json", () => {
			const extractorConfig: ExtractorConfig = ExtractorConfig.loadFileAndPrepare(
				path.join(testDataFolder, 'custom-tsdoc-tags/api-extractor.json'),
			);
			const { tsdocConfiguration } = extractorConfig;
			const block = tsdocConfiguration.tryGetTagDefinition('@block')!;
			const inline = tsdocConfiguration.tryGetTagDefinition('@inline')!;
			const modifier = tsdocConfiguration.tryGetTagDefinition('@modifier')!;

			expect(tsdocConfiguration.isTagSupported(block)).toBe(true);
			expect(tsdocConfiguration.isTagSupported(inline)).toBe(true);
			expect(tsdocConfiguration.isTagSupported(modifier)).toBe(false);
		});
		it.only("with standard tags and API Extractor custom tags defined and supported when the package's tsdoc.json extends API Extractor's tsdoc.json", () => {
			const extractorConfig: ExtractorConfig = ExtractorConfig.loadFileAndPrepare(
				path.join(testDataFolder, 'custom-tsdoc-tags/api-extractor.json'),
			);
			const { tsdocConfiguration } = extractorConfig;

			expect(tsdocConfiguration.tryGetTagDefinition('@inline')).not.toBe(undefined);
			expect(tsdocConfiguration.tryGetTagDefinition('@block')).not.toBe(undefined);
			expect(tsdocConfiguration.tryGetTagDefinition('@modifier')).not.toBe(undefined);

			for (const tag of StandardTags.allDefinitions.concat([
				tsdocConfiguration.tryGetTagDefinition('@betaDocumentation')!,
				tsdocConfiguration.tryGetTagDefinition('@internalRemarks')!,
				tsdocConfiguration.tryGetTagDefinition('@preapproved')!,
			])) {
				expect(tsdocConfiguration.tagDefinitions.includes(tag));
				expect(tsdocConfiguration.supportedTagDefinitions.includes(tag));
			}
		});
	});
});
