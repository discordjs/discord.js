// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import * as path from 'node:path';
import { FileSystem, PackageJsonLookup, type INodePackageJson, NewlineKind } from '@rushstack/node-core-library';
import { PackageMetadataManager } from '../PackageMetadataManager.js';

const packageJsonLookup: PackageJsonLookup = new PackageJsonLookup();

function resolveInTestPackage(testPackageName: string, ...args: string[]): string {
	return path.resolve(__dirname, 'test-data/tsdoc-metadata-path-inference', testPackageName, ...args);
}

function getPackageMetadata(testPackageName: string): {
	packageFolder: string;
	packageJson: INodePackageJson;
} {
	const packageFolder: string = resolveInTestPackage(testPackageName);
	const packageJson: INodePackageJson | undefined = packageJsonLookup.tryLoadPackageJsonFor(packageFolder);
	if (!packageJson) {
		throw new Error('There should be a package.json file in the test package');
	}

	return { packageFolder, packageJson };
}

function firstArgument(mockFn: jest.Mock): any {
	return mockFn.mock.calls[0][0];
}

describe(PackageMetadataManager.name, () => {
	describe(PackageMetadataManager.writeTsdocMetadataFile.name, () => {
		const originalWriteFile = FileSystem.writeFile;
		const mockWriteFile: jest.Mock = jest.fn();
		beforeAll(() => {
			FileSystem.writeFile = mockWriteFile;
		});
		afterEach(() => {
			mockWriteFile.mockClear();
		});
		afterAll(() => {
			FileSystem.writeFile = originalWriteFile;
		});

		it('writes the tsdoc metadata file at the provided path', () => {
			PackageMetadataManager.writeTsdocMetadataFile('/foo/bar', NewlineKind.CrLf);
			expect(firstArgument(mockWriteFile)).toBe('/foo/bar');
		});
	});

	describe(PackageMetadataManager.resolveTsdocMetadataPath.name, () => {
		describe('when an empty tsdocMetadataPath is provided', () => {
			const tsdocMetadataPath = '';
			describe('given a package.json where the field "tsdocMetadata" is defined', () => {
				it('outputs the tsdoc metadata path as given by "tsdocMetadata" relative to the folder of package.json', () => {
					const { packageFolder, packageJson } = getPackageMetadata('package-inferred-from-tsdoc-metadata');
					expect(PackageMetadataManager.resolveTsdocMetadataPath(packageFolder, packageJson, tsdocMetadataPath)).toBe(
						path.resolve(packageFolder, packageJson.tsdocMetadata as string),
					);
				});
			});
			describe('given a package.json where the field "typings" is defined and "tsdocMetadata" is not defined', () => {
				it('outputs the tsdoc metadata file "tsdoc-metadata.json" in the same folder as the path of "typings"', () => {
					const { packageFolder, packageJson } = getPackageMetadata('package-inferred-from-typings');
					expect(PackageMetadataManager.resolveTsdocMetadataPath(packageFolder, packageJson, tsdocMetadataPath)).toBe(
						path.resolve(packageFolder, path.dirname(packageJson.typings!), 'tsdoc-metadata.json'),
					);
				});
			});
			describe('given a package.json where the field "main" is defined but not "typings" nor "tsdocMetadata"', () => {
				it('outputs the tsdoc metadata file "tsdoc-metadata.json" in the same folder as the path of "main"', () => {
					const { packageFolder, packageJson } = getPackageMetadata('package-inferred-from-main');
					expect(PackageMetadataManager.resolveTsdocMetadataPath(packageFolder, packageJson, tsdocMetadataPath)).toBe(
						path.resolve(packageFolder, path.dirname(packageJson.main!), 'tsdoc-metadata.json'),
					);
				});
			});
			describe('given a package.json where the fields "main", "typings" and "tsdocMetadata" are not defined', () => {
				it('outputs the tsdoc metadata file "tsdoc-metadata.json" in the folder where package.json is located', () => {
					const { packageFolder, packageJson } = getPackageMetadata('package-default');
					expect(PackageMetadataManager.resolveTsdocMetadataPath(packageFolder, packageJson, tsdocMetadataPath)).toBe(
						path.resolve(packageFolder, 'tsdoc-metadata.json'),
					);
				});
			});
		});
		describe('when a non-empty tsdocMetadataPath is provided', () => {
			const tsdocMetadataPath = 'path/to/custom-tsdoc-metadata.json';
			describe('given a package.json where the field "tsdocMetadata" is defined', () => {
				it('outputs the tsdoc metadata file at the provided path in the folder where package.json is located', () => {
					const { packageFolder, packageJson } = getPackageMetadata('package-inferred-from-tsdocMetadata');
					expect(PackageMetadataManager.resolveTsdocMetadataPath(packageFolder, packageJson, tsdocMetadataPath)).toBe(
						path.resolve(packageFolder, tsdocMetadataPath),
					);
				});
			});
			describe('given a package.json where the field "typings" is defined and "tsdocMetadata" is not defined', () => {
				it('outputs the tsdoc metadata file at the provided path in the folder where package.json is located', () => {
					const { packageFolder, packageJson } = getPackageMetadata('package-inferred-from-typings');
					expect(PackageMetadataManager.resolveTsdocMetadataPath(packageFolder, packageJson, tsdocMetadataPath)).toBe(
						path.resolve(packageFolder, tsdocMetadataPath),
					);
				});
			});
			describe('given a package.json where the field "main" is defined but not "typings" nor "tsdocMetadata"', () => {
				it('outputs the tsdoc metadata file at the provided path in the folder where package.json is located', () => {
					const { packageFolder, packageJson } = getPackageMetadata('package-inferred-from-main');
					expect(PackageMetadataManager.resolveTsdocMetadataPath(packageFolder, packageJson, tsdocMetadataPath)).toBe(
						path.resolve(packageFolder, tsdocMetadataPath),
					);
				});
			});
			describe('given a package.json where the fields "main", "typings" and "tsdocMetadata" are not defined', () => {
				it('outputs the tsdoc metadata file at the provided path in the folder where package.json is located', () => {
					const { packageFolder, packageJson } = getPackageMetadata('package-default');
					expect(PackageMetadataManager.resolveTsdocMetadataPath(packageFolder, packageJson, tsdocMetadataPath)).toBe(
						path.resolve(packageFolder, tsdocMetadataPath),
					);
				});
			});
		});
	});
});
