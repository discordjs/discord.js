// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import * as path from 'node:path';
import { Path, Text } from '@rushstack/node-core-library';
import type * as ts from 'typescript';

export interface ISourceFileLocationFormatOptions {
	sourceFileColumn?: number | undefined;
	sourceFileLine?: number | undefined;
	workingPackageFolderPath?: string | undefined;
}

export class SourceFileLocationFormatter {
	/**
	 * Returns a string such as this, based on the context information in the provided node:
	 *   "[C:\\Folder\\File.ts#123]"
	 */
	public static formatDeclaration(node: ts.Node, workingPackageFolderPath?: string): string {
		const sourceFile: ts.SourceFile = node.getSourceFile();
		const lineAndCharacter: ts.LineAndCharacter = sourceFile.getLineAndCharacterOfPosition(node.getStart());

		return SourceFileLocationFormatter.formatPath(sourceFile.fileName, {
			sourceFileLine: lineAndCharacter.line + 1,
			sourceFileColumn: lineAndCharacter.character + 1,
			workingPackageFolderPath,
		});
	}

	public static formatPath(sourceFilePath: string, options?: ISourceFileLocationFormatOptions): string {
		const ioptions = options ?? {};

		let result = '';

		// Make the path relative to the workingPackageFolderPath
		let scrubbedPath: string = sourceFilePath;

		if (
			ioptions.workingPackageFolderPath && // If it's under the working folder, make it a relative path
			Path.isUnderOrEqual(sourceFilePath, ioptions.workingPackageFolderPath)
		) {
			scrubbedPath = path.relative(ioptions.workingPackageFolderPath, sourceFilePath);
		}

		// Convert it to a Unix-style path
		scrubbedPath = Text.replaceAll(scrubbedPath, '\\', '/');
		result += scrubbedPath;

		if (ioptions.sourceFileLine) {
			result += `:${ioptions.sourceFileLine}`;

			if (ioptions.sourceFileColumn) {
				result += `:${ioptions.sourceFileColumn}`;
			}
		}

		return result;
	}
}
