import process from 'node:process';
import { setFailed } from '@actions/core';
import { generateAllIndices } from '@discordjs/scripts';
import Cloudflare from 'cloudflare';
import { type EnqueuedTask, MeiliSearch } from 'meilisearch';
import pLimit from 'p-limit';
import { fetch } from 'undici';

if (!process.env.CF_D1_DOCS_API_KEY || !process.env.CF_D1_DOCS_ID || !process.env.CF_ACCOUNT_ID) {
	setFailed('Missing Cloudflare D1 environment variables.');
	process.exit(1);
}

if (!process.env.SEARCH_API_URL) {
	setFailed('SEARCH_API_URL is not set');
	process.exit(1);
}

if (!process.env.SEARCH_API_KEY) {
	setFailed('SEARCH_API_KEY is not set');
	process.exit(1);
}

const cf = new Cloudflare({
	apiToken: process.env.CF_D1_DOCS_API_KEY,
});

const client = new MeiliSearch({
	host: process.env.SEARCH_API_URL,
	apiKey: process.env.SEARCH_API_KEY,
});

const limit = pLimit(5);

try {
	console.log('Generating all indices...');
	const indices = await generateAllIndices({
		fetchPackageVersions: async (pkg) => {
			console.info(`Fetching versions for ${pkg}...`);

			const { result } = await cf.d1.database.query(process.env.CF_D1_DOCS_ID!, {
				account_id: process.env.CF_ACCOUNT_ID!,
				sql: `select version from documentation where name = ? order by version desc;`,
				params: [pkg],
			});

			return ((result[0]?.results as { version: string }[] | undefined) ?? []).map((row) => row.version);
		},
		fetchPackageVersionDocs: async (pkg, version) => {
			console.log(`Fetching data for ${pkg} ${version}...`);

			const { result } = await cf.d1.database.query(process.env.CF_D1_DOCS_ID!, {
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

	const promises = indices.map(async (index) =>
		limit(async () => {
			console.log(`Uploading ${index.index}...`);
			let task: EnqueuedTask | undefined;
			try {
				task = await client.createIndex(index.index);
			} catch {}

			if (task) {
				await client.tasks.waitForTask(task, { timeout: 10_000 });
			}

			const searchIndex = client.index(index.index);
			await searchIndex.updateSettings({ sortableAttributes: ['type'] });

			await searchIndex.addDocuments(index.data);
		}),
	);

	await Promise.all(promises);

	console.log('Uploaded all indices.');
} catch (error) {
	const err = error as Error;
	console.error(err);
	setFailed(err.message);
	process.exit(1);
}
