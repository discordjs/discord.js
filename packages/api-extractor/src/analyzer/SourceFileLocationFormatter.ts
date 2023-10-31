// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import type * as ts from 'typescript';
import * as path from 'path';
import { Path, Text } from '@rushstack/node-core-library';

export interface ISourceFileLocationFormatOptions {
  sourceFileLine?: number;
  sourceFileColumn?: number;
  workingPackageFolderPath?: string;
}

export class SourceFileLocationFormatter {
  /**
   * Returns a string such as this, based on the context information in the provided node:
   *   "[C:\Folder\File.ts#123]"
   */
  public static formatDeclaration(node: ts.Node, workingPackageFolderPath?: string): string {
    const sourceFile: ts.SourceFile = node.getSourceFile();
    const lineAndCharacter: ts.LineAndCharacter = sourceFile.getLineAndCharacterOfPosition(node.getStart());

    return SourceFileLocationFormatter.formatPath(sourceFile.fileName, {
      sourceFileLine: lineAndCharacter.line + 1,
      sourceFileColumn: lineAndCharacter.character + 1,
      workingPackageFolderPath
    });
  }

  public static formatPath(sourceFilePath: string, options?: ISourceFileLocationFormatOptions): string {
    if (!options) {
      options = {};
    }

    let result: string = '';

    // Make the path relative to the workingPackageFolderPath
    let scrubbedPath: string = sourceFilePath;

    if (options.workingPackageFolderPath) {
      // If it's under the working folder, make it a relative path
      if (Path.isUnderOrEqual(sourceFilePath, options.workingPackageFolderPath)) {
        scrubbedPath = path.relative(options.workingPackageFolderPath, sourceFilePath);
      }
    }

    // Convert it to a Unix-style path
    scrubbedPath = Text.replaceAll(scrubbedPath, '\\', '/');
    result += scrubbedPath;

    if (options.sourceFileLine) {
      result += `:${options.sourceFileLine}`;

      if (options.sourceFileColumn) {
        result += `:${options.sourceFileColumn}`;
      }
    }

    return result;
  }
}
