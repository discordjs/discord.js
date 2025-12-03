import { readFile } from 'node:fs/promises';
import process from 'node:process';
import { getInput, info, setFailed } from '@actions/core';
import { create } from '@actions/glob';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import Cloudflare from 'cloudflare';
import pLimit from 'p-limit';

if (
	!process.env.CF_R2_DOCS_URL ||
	!process.env.CF_R2_DOCS_ACCESS_KEY_ID ||
	!process.env.CF_R2_DOCS_SECRET_ACCESS_KEY ||
	!process.env.CF_R2_DOCS_BUCKET ||
	!process.env.CF_R2_DOCS_BUCKET_URL ||
	!process.env.CF_D1_DOCS_API_KEY ||
	!process.env.CF_D1_DOCS_ID ||
	!process.env.CF_ACCOUNT_ID ||
	!process.env.CF_R2_READMES_ACCESS_KEY_ID ||
	!process.env.CF_R2_READMES_SECRET_ACCESS_KEY ||
	!process.env.CF_R2_READMES_BUCKET ||
	!process.env.CF_R2_READMES_URL
) {
	setFailed('Missing environment variables');
}

const pkg = getInput('package') || '*';
const version = getInput('version') || 'main';

const S3Docs = new S3Client({
	region: 'auto',
	endpoint: process.env.CF_R2_DOCS_URL!,
	credentials: {
		accessKeyId: process.env.CF_R2_DOCS_ACCESS_KEY_ID!,
		secretAccessKey: process.env.CF_R2_DOCS_SECRET_ACCESS_KEY!,
	},
	requestChecksumCalculation: 'WHEN_REQUIRED',
	responseChecksumValidation: 'WHEN_REQUIRED',
});

const S3READMEFiles = new S3Client({
	region: 'auto',
	endpoint: process.env.CF_R2_READMES_URL!,
	credentials: {
		accessKeyId: process.env.CF_R2_READMES_ACCESS_KEY_ID!,
		secretAccessKey: process.env.CF_R2_READMES_SECRET_ACCESS_KEY!,
	},
	requestChecksumCalculation: 'WHEN_REQUIRED',
	responseChecksumValidation: 'WHEN_REQUIRED',
});

const client = new Cloudflare({
	apiToken: process.env.CF_D1_DOCS_API_KEY,
});

const limit = pLimit(10);
const promises = [];

// Only look for packages where documentation exists.
const globber = await create(`packages/${pkg}/docs/docs.api.json`);
const docsFiles = await globber.glob();

// Upload documentation.
for (const file of docsFiles) {
	const data = await readFile(file, 'utf8');
	try {
		promises.push(
			limit(async () => {
				info(`Uploading ${file} with ${version}...`);
				const json = JSON.parse(data);
				const name = json.name ?? json.n;
				const packageNameUnscoped = name.replace('@discordjs/', '');
				const key = `${packageNameUnscoped}/${version}.json`;

				await S3Docs.send(
					new PutObjectCommand({
						Bucket: process.env.CF_R2_DOCS_BUCKET,
						Key: key,
						Body: data,
					}),
				);

				await client.d1.database.raw(process.env.CF_D1_DOCS_ID!, {
					account_id: process.env.CF_ACCOUNT_ID!,
					sql: `insert into documentation (name, version, url) values (?, ?, ?) on conflict (name, version) do update set url = excluded.url;`,
					params: [packageNameUnscoped, version, process.env.CF_R2_DOCS_BUCKET_URL + '/' + key],
				});

				try {
					const readmePath = file.replace('/docs/docs.api.json', '/README.md');
					info(`Uploading ${readmePath}...`);
					const readmeData = await readFile(readmePath, 'utf8');
					const readmeKey = `${packageNameUnscoped}/home-README.md`;

					await S3READMEFiles.send(
						new PutObjectCommand({
							Bucket: process.env.CF_R2_READMES_BUCKET,
							Key: readmeKey,
							Body: readmeData,
						}),
					);

					info(`Successfully uploaded README.md for ${name}`);
				} catch (readmeError) {
					console.log(`Failed to upload README.md for ${name}: ${readmeError}`);
				}
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
