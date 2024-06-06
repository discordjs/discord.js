import { readFile, writeFile } from 'node:fs/promises';

const rawTypesDTS = new URL('../typings/rawDataTypes.d.ts', import.meta.url);
const rawIndexDTS = new URL('../typings/index.d.ts', import.meta.url);

const rawTypesMDTS = new URL('../typings/rawDataTypes.d.mts', import.meta.url);
const rawIndexMTS = new URL('../typings/index.d.mts', import.meta.url);

const [rawTypesString, rawIndexString] = await Promise.all([
  readFile(rawTypesDTS, 'utf8'),
  readFile(rawIndexDTS, 'utf8'),
]);

/**
 *
 * @param {string} source
 * @param {[from: string, to: string][]} imports
 */
function updateImports(source, imports) {
  return imports.reduce((code, [from, to]) => {
    return code.replaceAll(from, to);
  }, source);
}

/** @type {[string, string][]} */
const rawTypesImports = [
  ['./index.js', './index.mjs'], //
];

/** @type {[string, string][]} */
const rawIndexImports = [
  ['./rawDataTypes.js', './rawDataTypes.mjs'], //
];

const rawTypesMDTSString = updateImports(rawTypesString, rawTypesImports);
const rawIndexMTSString = updateImports(rawIndexString, rawIndexImports);

await Promise.all([writeFile(rawTypesMDTS, rawTypesMDTSString), writeFile(rawIndexMTS, rawIndexMTSString)]);
