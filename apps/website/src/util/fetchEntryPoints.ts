import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
// import { sql } from '@vercel/postgres';
import { ENV } from './env';

export async function fetchEntryPoints(packageName: string, version: string) {
	if (ENV.IS_LOCAL_DEV) {
		const fileContent = await readFile(
			join(process.cwd(), `../../packages/${packageName}/docs/${packageName}/split/${version}.entrypoints.api.json`),
			'utf8',
		);

		return JSON.parse(fileContent);
	}

	// try {
	// 	const { rows } = await sql<{
	// 		entryPoint: string;
	// 	}>`select entryPoint from documentation where name = ${packageName} and version = ${version} order by
	// 		case
	// 			when version = 'main' then 0
	// 			else 1
	// 		end,
	// 		case
	// 			when version = 'main' then null
	// 			else string_to_array(version, '.')::int[]
	// 		end desc;
	// 	`;

	// 	return rows;
	// } catch {
	return [];
	// }
}
