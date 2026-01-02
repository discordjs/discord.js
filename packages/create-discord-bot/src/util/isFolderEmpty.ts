/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2025 Vercel, Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy,
 * modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
 * FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * Source: https://github.com/vercel/next.js/blob/7fb2aa908216fb3a910c7fa6d24524412b5af6e5/packages/create-next-app/helpers/is-folder-empty.ts
 */
import { lstatSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { styleText } from 'node:util';

export function isFolderEmpty(root: string, name: string): boolean {
	const validFiles = [
		'.DS_Store',
		'.git',
		'.gitattributes',
		'.gitignore',
		'.gitlab-ci.yml',
		'.hg',
		'.hgcheck',
		'.hgignore',
		'.idea',
		'.npmignore',
		'.travis.yml',
		'LICENSE',
		'Thumbs.db',
		'docs',
		'mkdocs.yml',
		'npm-debug.log',
		'yarn-debug.log',
		'yarn-error.log',
		'yarnrc.yml',
		'.yarn',
	];

	const conflicts = readdirSync(root).filter(
		(file) =>
			!validFiles.includes(file) &&
			// Support IntelliJ IDEA-based editors
			!file.endsWith('.iml'),
	);

	if (conflicts.length > 0) {
		console.log(`The directory ${styleText('green', name)} contains files that could conflict:`);
		console.log();
		for (const file of conflicts) {
			try {
				const stats = lstatSync(join(root, file));
				if (stats.isDirectory()) {
					console.log(`  ${styleText('blue', file)}/`);
				} else {
					console.log(`  ${file}`);
				}
			} catch {
				console.log(`  ${file}`);
			}
		}

		console.log();
		console.log('Either try using a new directory name, or remove the files listed above.');
		console.log();
		return false;
	}

	return true;
}
