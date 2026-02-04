import { readFile } from 'node:fs/promises';
import process from 'node:process';
import { info, setFailed } from '@actions/core';
import { create } from '@actions/glob';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

if (
	!process.env.CF_R2_READMES_ACCESS_KEY_ID ||
	!process.env.CF_R2_READMES_SECRET_ACCESS_KEY ||
	!process.env.CF_R2_READMES_BUCKET ||
	!process.env.CF_R2_READMES_URL
) {
	setFailed('Missing environment variables.');
	process.exit(1);
}

const S3READMEFiles = new S3Client({
	region: 'auto',
	endpoint: process.env.CF_R2_READMES_URL,
	credentials: {
		accessKeyId: process.env.CF_R2_READMES_ACCESS_KEY_ID,
		secretAccessKey: process.env.CF_R2_READMES_SECRET_ACCESS_KEY,
	},
	requestChecksumCalculation: 'WHEN_REQUIRED',
	responseChecksumValidation: 'WHEN_REQUIRED',
});

const promises = [];

// Find all packages with an api-extractor.json file.
const globber = await create('packages/*/api-extractor.json');

for await (const apiExtractorFile of globber.globGenerator()) {
	const readmePath = apiExtractorFile.replace('/api-extractor.json', '/README.md');
	const packageName = apiExtractorFile.split('/').at(-2)!;
	const readmeKey = `${packageName}/home-README.md`;
	info(`Uploading ${readmePath}...`);

	promises.push(
		// eslint-disable-next-line promise/prefer-await-to-then
		readFile(readmePath, 'utf8').then(async (readmeData) =>
			S3READMEFiles.send(
				new PutObjectCommand({
					Bucket: process.env.CF_R2_READMES_BUCKET,
					Key: readmeKey,
					Body: readmeData,
				}),
			),
		),
	);
}

try {
	await Promise.all(promises);
	info('All README.md files uploaded successfully!');
} catch (error) {
	setFailed(`Failed to upload README files: ${error}`);
	process.exit(1);
}
