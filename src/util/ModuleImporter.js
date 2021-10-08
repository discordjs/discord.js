'use strict';

const fs = require('node:fs');
const path = require('node:path');

/**
 * The ModuleImporter helper class is used to import local files, by using the bundler or file system, whichever is
 * needed in the current build.
 *
 * @private
 */
class ModuleImporter extends null {
  /**
   * This method is used to import a variable number of files in a specific directory and is built to also work with
   * webpack and potentially other bundlers.
   *
   * @param {string} pathToDirectory the path to the searched directory (relative to the `src` directory)
   * @param {string[]} [excludedFiles=[]] an array of files which are excluded from the import
   *
   * @returns {unknown[]} an array of dynamically imported modules
   */
  static import(pathToDirectory, excludedFiles = []) {
    pathToDirectory = path.normalize(pathToDirectory);

    let moduleMap;

    if (typeof __webpack_require__ === 'function') {
      moduleMap = this.importWebpack(pathToDirectory);
    } else {
      moduleMap = this.importFilesystem(pathToDirectory);
    }

    const requiredModules = [];
    for (const [fileName, requireFunction] of moduleMap.entries()) {
      if (excludedFiles.includes(path.basename(fileName))) continue;
      requiredModules.push(requireFunction());
    }

    return requiredModules;
  }

  /**
   * Helper function to import all modules in a given directory via file system.
   *
   * @param {string} pathToDirectory the path to the searched directory (relative to the `src` directory)
   * @returns {Map<string, Function>} a map of resolved file names to their require function
   *
   * @private
   */
  static importFilesystem(pathToDirectory) {
    const basePath = path.resolve(__dirname, '..', pathToDirectory);
    const files = fs.readdirSync(basePath);
    // Require Function is returned for lazy evaluation
    return new Map(files.map(file => [file, () => require(path.join(basePath, file))]));
  }

  /**
   * Helper function to import all modules in a given directory via webpack.context.
   *
   * @param {string} pathToDirectory the path to the searched directory (relative to the `src` directory)
   * @returns {Map<string, Function>} a map of resolved file names to their require function
   *
   * @private
   */
  static importWebpack(pathToDirectory) {
    // The "function" `require.context` is actually evaluated at build/bundling time, and needs to be called with
    // literals because of that. By building a context of '..' we actually cover the whole codebase and can
    // dynamically import any subdirectory. When not using webpack, the following line is never evaluated.
    const context = require.context('..', true, /\.js$/);

    const files = context
      .keys()
      // We have all files in our context, so now we filter the files in the correct directory
      .filter(file => path.normalize(file).startsWith(pathToDirectory));

    return new Map(files.map(file => [file, () => context(file)]));
  }
}

module.exports = ModuleImporter;
