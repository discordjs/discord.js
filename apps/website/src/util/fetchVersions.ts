import { sql } from '@vercel/postgres';
import { ENV } from './env';

export async function fetchVersions(packageName: string) {
	if (ENV.IS_LOCAL_DEV) {
		return [{ version: 'main' }];
	}

	try {
		const { rows } = await sql<{
			version: string;
		}>`select version from documentation where name = ${packageName} order by
			case
				when version = 'main' then 0
				else 1
			end,
			case
				when version = 'main' then null
				else string_to_array(version, '.')::int[]
			end desc;
		`;

		return rows;
	} catch {
		return [];
	}
}
