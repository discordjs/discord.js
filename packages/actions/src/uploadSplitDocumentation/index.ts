import { readFile } from 'node:fs/promises';
import { basename, dirname, relative, sep } from 'node:path';
import process from 'node:process';
import { setTimeout as sleep } from 'node:timers/promises';
import { setFailed, getInput } from '@actions/core';
import { create } from '@actions/glob';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import PQueue from 'p-queue';

if (
	!process.env.CF_R2_DOCS_URL ||
	!process.env.CF_R2_DOCS_ACCESS_KEY_ID ||
	!process.env.CF_R2_DOCS_SECRET_ACCESS_KEY ||
	!process.env.CF_R2_DOCS_BUCKET
) {
	setFailed('Missing environment variables');
}

const pkg = getInput('package') || '*';
const version = getInput('version') || 'main';

const queue = new PQueue({ concurrency: 10, interval: 60_000, intervalCap: 1_000 });
const promises = [];
const failedUploads: string[] = [];

const S3 = new S3Client({
	region: 'auto',
	endpoint: process.env.CF_R2_DOCS_URL!,
	credentials: {
		accessKeyId: process.env.CF_R2_DOCS_ACCESS_KEY_ID!,
		secretAccessKey: process.env.CF_R2_DOCS_SECRET_ACCESS_KEY!,
	},
	requestChecksumCalculation: 'WHEN_REQUIRED',
	responseChecksumValidation: 'WHEN_REQUIRED',
});

const globber = await create(`packages/${pkg}/docs/${pkg}/split/*.api.json`);
console.log('Glob: ', await globber.glob());
for await (const file of globber.globGenerator()) {
	const data = await readFile(file, 'utf8');
	const pkgName = dirname(relative(process.cwd(), file)).split(sep)[1];
	try {
		promises.push(
			queue.add(async () => {
				console.log(`Uploading ${file} with ${version} from ${pkgName}...`);
				const name = basename(file).replace('main.', '');
				async function upload(retries = 0) {
					try {
						await S3.send(
							new PutObjectCommand({
								Bucket: process.env.CF_R2_DOCS_BUCKET,
								Key: `${pkgName}/${version}.${name}`,
								Body: data,
							}),
						);
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
