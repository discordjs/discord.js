import process from 'node:process';
import { setFailed } from '@actions/core';
import { generateAllIndices } from '@discordjs/scripts';
import { MeiliSearch } from 'meilisearch';
import pLimit from 'p-limit';
import { fetch } from 'undici';
import Cloudflare from 'cloudflare';

if (!(process.env.CF_D1_DOCS_API_KEY && process.env.CF_D1_DOCS_ID && process.env.CF_ACCOUNT_ID)) {
	setFailed('Missing Cloudflare D1 environment variables.');
}

if (!process.env.DATABASE_URL) {
	setFailed('DATABASE_URL is not set');
}

if (!process.env.SEARCH_API_URL) {
	setFailed('SEARCH_API_URL is not set');
}

if (!process.env.SEARCH_API_KEY) {
	setFailed('SEARCH_API_KEY is not set');
}

const r2 = new Cloudflare({
	apiToken: process.env.CF_D1_DOCS_API_KEY!,
});

const client = new MeiliSearch({
	host: process.env.SEARCH_API_URL!,
	apiKey: process.env.SEARCH_API_KEY!,
});

const limit = pLimit(10);
let promises: Promise<any>[] = [];

try {
	console.log('Generating all indices...');
	const indices = await generateAllIndices({
		fetchPackageVersions: async (pkg) => {
			console.info(`Fetching versions for ${pkg}...`);

			const { result } = await r2.d1.database.query(process.env.CF_D1_DOCS_ID!, {
				account_id: process.env.CF_ACCOUNT_ID!,
				sql: `select version from documentation where name = ? order by version desc;`,
				params: [pkg],
			});

			return ((result[0]?.results as { version: string }[] | undefined) ?? []).map((row) => row.version);
		},
		fetchPackageVersionDocs: async (pkg, version) => {
			console.log(`Fetching data for ${pkg} ${version}...`);

			const { result } = await r2.d1.database.query(process.env.CF_D1_DOCS_ID!, {
				account_id: process.env.CF_ACCOUNT_ID!,
				sql: `select url from documentation where name = ? and version = ?;`,
				params: [pkg, version],
			});

			const res = await fetch(((result[0]?.results as { url: string }[] | undefined) ?? [])[0]?.url ?? '');
			return res.json();
		},
		writeToFile: false,
	});
	console.log('Generated all indices.');

	console.log('Uploading indices...');

	try {
		promises = indices.map(async (index) =>
			limit(async () => {
				console.log(`Uploading ${index.index}...`);
				let task;
				try {
					task = await client.createIndex(index.index);
				} catch {}

				if (task) {
					await client.waitForTask(task.taskUid);
				}

				const searchIndex = client.index(index.index);
				await searchIndex.updateSettings({ sortableAttributes: ['type'] });

				await searchIndex.addDocuments(index.data);
			}),
		);
	} catch {}

	console.log('Uploaded all indices.');
} catch (error) {
	const err = error as Error;
	setFailed(err.message);
}

try {
	await Promise.all(promises);
} catch (error) {
	console.log(error);
}
