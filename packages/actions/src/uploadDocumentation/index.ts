import { readFile } from 'node:fs/promises';
import process from 'node:process';
import { getInput, setFailed } from '@actions/core';
import { create } from '@actions/glob';
import { createPool } from '@vercel/postgres';

if (!process.env.DATABASE_URL) {
	setFailed('DATABASE_URL is not set');
}

const pkg = getInput('package') || '*';
const version = getInput('version') || 'main';

const pool = createPool({
	connectionString: process.env.DATABASE_URL,
});

const globber = await create(`packages/${pkg}/docs/docs.api.json`);
for await (const file of globber.globGenerator()) {
	const data = await readFile(file, 'utf8');
	try {
		console.log(`Uploading ${file} with ${version}...`);
		await pool.sql`insert into documentation (version, data) values (${version}, ${data}) on conflict (version) do update set data = EXCLUDED.data`;
	} catch (error) {
		const err = error as Error;
		setFailed(err.message);
	}
}
