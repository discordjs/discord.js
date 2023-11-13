import process from 'node:process';
import { setFailed } from '@actions/core';
import { generateAllIndices } from '@discordjs/scripts';
import { createPool } from '@vercel/postgres';
import { MeiliSearch } from 'meilisearch';
import { fetch } from 'undici';

if (!process.env.DATABASE_URL) {
	setFailed('DATABASE_URL is not set');
}

if (!process.env.SEARCH_API_URL) {
	setFailed('SEARCH_API_URL is not set');
}

if (!process.env.SEARCH_API_KEY) {
	setFailed('SEARCH_API_KEY is not set');
}

const pool = createPool({
	connectionString: process.env.DATABASE_URL,
});

const client = new MeiliSearch({
	host: process.env.SEARCH_API_URL!,
	apiKey: process.env.SEARCH_API_KEY!,
});

try {
	console.log('Generating all indices...');
	const indices = await generateAllIndices({
		fetchPackageVersions: async (pkg) => {
			console.log(`Fetching versions for ${pkg}...`);
			const { rows } = await pool.sql`select version from documentation where name = ${pkg}`;

			return rows.map((row) => row.version);
		},
		fetchPackageVersionDocs: async (pkg, version) => {
			console.log(`Fetching data for ${pkg} ${version}...`);
			const { rows } = await pool.sql`select url from documentation where name = ${pkg} and version = ${version}`;
			const res = await fetch(rows[0]?.url ?? '');

			return res.json();
		},
		writeToFile: false,
	});
	console.log('Generated all indices.');

	console.log('Uploading indices...');

	try {
		await Promise.all(
			indices.map(async (index) => {
				console.log(`Uploading ${index.index}...`);
				await client.createIndex(index.index);
				await client.index(index.index).addDocuments(index.data);
			}),
		);
	} catch {}

	console.log('Uploaded all indices.');
} catch (error) {
	const err = error as Error;
	setFailed(err.message);
}
