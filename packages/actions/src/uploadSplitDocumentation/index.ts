import { readFile } from 'node:fs/promises';
import { basename, dirname, relative, sep } from 'node:path';
import { cwd } from 'node:process';
import { getInput } from '@actions/core';
import { create } from '@actions/glob';
import { put } from '@vercel/blob';
import pLimit from 'p-limit';

const pkg = getInput('package') || '*';
const version = getInput('version') || 'main';

const limit = pLimit(10);
const promises = [];

const globber = await create(`packages/${pkg}/docs/${pkg}/split/*.api.json`);
console.log('Glob: ', await globber.glob());
for await (const file of globber.globGenerator()) {
	const data = await readFile(file, 'utf8');
	const pkgName = dirname(relative(cwd(), file)).split(sep)[1];
	try {
		promises.push(
			// eslint-disable-next-line @typescript-eslint/no-loop-func
			limit(async () => {
				console.log(`Uploading ${file} with ${version} from ${pkgName}...`);
				const name = basename(file).replace('main.', '');
				await put(`rewrite/${pkgName}/${version}.${name}`, data, {
					access: 'public',
					addRandomSuffix: false,
				});
			}),
		);
	} catch (error) {
		console.log(error);
	}
}

try {
	await Promise.all(promises);
} catch (error) {
	console.log(error);
}
