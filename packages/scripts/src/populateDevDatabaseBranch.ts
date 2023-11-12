// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference lib="dom" />

import { readFile } from 'node:fs/promises';
import process, { cwd } from 'node:process';
import { create } from '@actions/glob';
import { connect } from '@planetscale/database';

const sql = connect({
	url: process.env.DATABASE_URL!,
});

process.chdir(`${cwd()}/../../`);
const globber = await create(`packages/*/docs/*.api.json`);
// const globber2 = await create(`discord.js/*.json`);
for await (const file of globber.globGenerator()) {
	const parsed = /(?<semver>\d+.\d+.\d+)-?.*/.exec(file);
	const data = await readFile(file, 'utf8');

	if (parsed?.groups) {
		console.log(parsed.groups.semver, file);
		try {
			await sql.execute('replace into documentation (version, data) values (?, ?)', [parsed.groups.semver, data]);
		} catch (error) {
			console.error(error);
		}
	} else {
		console.log('main', file);
		try {
			await sql.execute('replace into documentation (version, data) values (?, ?)', ['main', data]);
		} catch (error) {
			console.error(error);
		}
	}
}
