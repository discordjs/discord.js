import { readFile } from 'node:fs/promises';
import { basename } from 'node:path';
import process from 'node:process';
import { getInput, setFailed } from '@actions/core';
import { create } from '@actions/glob';
import { put } from '@vercel/blob';
import { createPool } from '@vercel/postgres';

if (!process.env.DATABASE_URL) {
	setFailed('DATABASE_URL is not set');
}

const pkg = getInput('package') || '*';
const version = getInput('version') || 'main';

const pool = createPool({
	connectionString: process.env.DATABASE_URL,
});

const globber = await create(`packages/${pkg}/docs/split/main.*.*.api.json`);
for await (const file of globber.globGenerator()) {
	const data = await readFile(file, 'utf8');
	try {
		console.log(`Uploading ${file} with ${version}...`);
		const name = basename(file).replace('main.', '');
		const { url } = await put(`${version}.${name}`, data, {
			access: 'public',
			addRandomSuffix: false,
		});
		await pool.sql`insert into documentation (name, version, url) values (${name}, ${version}, ${url}) on conflict (name, version) do update set url = EXCLUDED.url`;
	} catch (error) {
		console.log(error);
	}
}
