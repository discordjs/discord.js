import { readFile } from 'node:fs/promises';
import { basename, dirname, relative, sep } from 'node:path';
import { cwd } from 'node:process';
import { setTimeout as sleep } from 'node:timers/promises';
import { setFailed, getInput } from '@actions/core';
import { create } from '@actions/glob';
import { put } from '@vercel/blob';
import PQueue from 'p-queue';

const pkg = getInput('package') || '*';
const version = getInput('version') || 'main';

const queue = new PQueue({ concurrency: 10, interval: 60_000, intervalCap: 1_000 });
const promises = [];
const failedUploads: string[] = [];

const globber = await create(`packages/${pkg}/docs/${pkg}/split/*.api.json`);
console.log('Glob: ', await globber.glob());
for await (const file of globber.globGenerator()) {
	const data = await readFile(file, 'utf8');
	const pkgName = dirname(relative(cwd(), file)).split(sep)[1];
	try {
		promises.push(
			// eslint-disable-next-line @typescript-eslint/no-loop-func
			queue.add(async () => {
				console.log(`Uploading ${file} with ${version} from ${pkgName}...`);
				const name = basename(file).replace('main.', '');
				async function upload(retries = 0) {
					try {
						await put(`rewrite/${pkgName}/${version}.${name}`, data, {
							access: 'public',
							addRandomSuffix: false,
						});
					} catch (error) {
						if (retries > 3) {
							console.error(`Could not upload ${file} after 3 retries`, error);
							failedUploads.push(name);
							return;
						}

						if (typeof error === 'object' && error && 'retryAfter' in error && typeof error.retryAfter === 'number') {
							await sleep(error.retryAfter * 1_000);
							return upload(retries + 1);
						} else {
							console.error(`Could not upload ${file}`, error);
							failedUploads.push(name);
						}
					}
				}

				await upload();
			}),
		);
	} catch (error) {
		console.log(error);
	}
}

try {
	await Promise.all(promises);
	if (failedUploads.length) {
		setFailed(`Failed to upload ${failedUploads.length} files: ${failedUploads.join(', ')}`);
	}
} catch (error) {
	console.log(error);
}
