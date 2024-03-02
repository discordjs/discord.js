import { readFile } from 'node:fs/promises';
import { basename } from 'node:path';
import { getInput } from '@actions/core';
import { create } from '@actions/glob';
import { put } from '@vercel/blob';
import pLimit from 'p-limit';

const pkg = getInput('package') || '*';
const version = getInput('version') || 'main';

const limit = pLimit(10);
const promises = [];

const globber = await create(`packages/${pkg}/docs/${pkg}/split/*.api.json`);
for await (const file of globber.globGenerator()) {
	const data = await readFile(file, 'utf8');
	try {
		promises.push(
			// eslint-disable-next-line @typescript-eslint/no-loop-func
			limit(async () => {
				console.log(`Uploading ${file} with ${version}...`);
				const name = basename(file).replace('main.', '');

				await put(`rewrite/${pkg}/${version}.${name}`, data, {
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
