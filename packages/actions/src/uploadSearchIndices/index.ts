import process from 'node:process';
import { setFailed } from '@actions/core';
import { generateAllIndices } from '@discordjs/scripts';
import { connect } from '@planetscale/database';
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

const sql = connect({
	fetch,
	url: process.env.DATABASE_URL!,
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
			const { rows } = await sql.execute('select version from documentation where name = ?', [pkg]);

			// @ts-expect-error: https://github.com/planetscale/database-js/issues/71
			return rows.map((row) => row.version);
		},
		fetchPackageVersionDocs: async (pkg, version) => {
			console.log(`Fetching data for ${pkg} ${version}...`);
			const { rows } = await sql.execute('select data from documentation where name = ? and version = ?', [
				pkg,
				version,
			]);

			// @ts-expect-error: https://github.com/planetscale/database-js/issues/71
			return rows[0].data;
		},
		writeToFile: false,
	});
	console.log('Generated all indices.');

	console.log('Uploading indices...');

	try {
		await Promise.all(
			indices.map(async (index) => {
				console.log(`Uploading ${index.index}...`);
				return client.index(index.index).addDocuments(index.data);
			}),
		);
	} catch {}

	console.log('Uploaded all indices.');
} catch (error) {
	const err = error as Error;
	setFailed(err.message);
}
