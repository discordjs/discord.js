import { readFile } from 'node:fs/promises';
import process, { cwd } from 'node:process';
import { create } from '@actions/glob';
import { put } from '@vercel/blob';
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
			const { name } = JSON.parse(data);
			const { url } = await put(`${name.replace('@discordjs/', '')}/${parsed.groups.semver}.json`, data, {
				access: 'public',
				addRandomSuffix: false,
			});
			await pool.sql`insert into documentation (name, version, url) values (${name.replace('@discordjs/', '')}, ${
				parsed.groups.semver
			}, ${url}) on conflict (name, version) do update set url = EXCLUDED.url`;
		} catch (error) {
			console.error(error);
		}
	} else {
		console.log('main', file);
		try {
			const { name } = JSON.parse(data);
			const { url } = await put(`${name.replace('@discordjs/', '')}/main.json`, data, {
				access: 'public',
				addRandomSuffix: false,
			});
			await pool.sql`insert into documentation (name, version, url) values (${name.replace(
				'@discordjs/',
				'',
			)}, ${'main'}, ${url}) on conflict (name, version) do update set url = EXCLUDED.url`;
		} catch (error) {
			console.error(error);
		}
	}
}
