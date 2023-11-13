import { readFile } from 'node:fs/promises';
import process, { cwd } from 'node:process';
import { create } from '@actions/glob';
import { createPool } from '@vercel/postgres';

const pool = createPool({
	connectionString: process.env.DATABASE_URL,
});

process.chdir(`${cwd()}/../../`);
const globber = await create(`packages/*/docs/*.api.json`);
for await (const file of globber.globGenerator()) {
	const parsed = /(?<semver>\d+.\d+.\d+)-?.*/.exec(file);
	const data = await readFile(file, 'utf8');

	if (parsed?.groups) {
		console.log(parsed.groups.semver, file);
		try {
			await pool.sql`insert into documentation (version, data) values (${parsed.groups.semver}, ${data}) on conflict (name, version) do update set data = EXCLUDED.data`;
		} catch (error) {
			console.error(error);
		}
	} else {
		console.log('main', file);
		try {
			await pool.sql`insert into documentation (version, data) values (${'main'}, ${data}) on conflict (name, version) do update set data = EXCLUDED.data`;
		} catch (error) {
			console.error(error);
		}
	}
}
