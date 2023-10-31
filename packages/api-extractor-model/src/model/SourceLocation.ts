// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import { URL } from 'url';

/**
 * Constructor options for `SourceLocation`.
 * @public
 */
export interface ISourceLocationOptions {
  /**
   * The project folder URL as defined by the `api-extractor.json` config `projectFolderUrl`
   * setting.
   */
  projectFolderUrl?: string;

  /**
   * The file URL path relative to the `projectFolder` and `projectFolderURL` fields as
   * defined in the `api-extractor.json` config.
   */
  fileUrlPath?: string;
}

/**
 * The source location where a given API item is declared.
 *
 * @remarks
 * The source location points to the `.ts` source file where the API item was originally
   declared. However, in some cases, if source map resolution fails, it falls back to pointing
   to the `.d.ts` file instead.
 *
 * @public
 */
export class SourceLocation {
  private readonly _projectFolderUrl?: string;
  private readonly _fileUrlPath?: string;

  public constructor(options: ISourceLocationOptions) {
    this._projectFolderUrl = options.projectFolderUrl;
    this._fileUrlPath = options.fileUrlPath;
  }

  /**
   * Returns the file URL to the given source location. Returns `undefined` if the file URL
   * cannot be determined.
   */
  public get fileUrl(): string | undefined {
    if (this._projectFolderUrl === undefined || this._fileUrlPath === undefined) {
      return undefined;
    }

    let projectFolderUrl: string = this._projectFolderUrl;
    if (!projectFolderUrl.endsWith('/')) {
      projectFolderUrl += '/';
    }

    const url: URL = new URL(this._fileUrlPath, projectFolderUrl);
    return url.href;
  }
}
