import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function splitIds(value = '') {
	return value
		.split(',')
		.map((item) => item.trim())
		.filter(Boolean);
}

export function getConfig(environment = process.env) {
	return {
		token: environment.DISCORD_TOKEN,
		clientId: environment.DISCORD_CLIENT_ID,
		guildId: environment.DISCORD_GUILD_ID,
		dataFile: environment.LRP_DATA_FILE || path.join(rootDirectory, 'data', 'runtime.json'),
		roleIds: {
			cadet: splitIds(environment.LRP_ROLE_CADET),
			officer: splitIds(environment.LRP_ROLE_OFFICER),
			supervisor: splitIds(environment.LRP_ROLE_SUPERVISOR),
			chief: splitIds(environment.LRP_ROLE_CHIEF),
			command: splitIds(environment.LRP_ROLE_COMMAND),
		},
	};
}

export function requireEnvironment(config, keys) {
	const missing = keys.filter((key) => !config[key]);
	if (missing.length > 0) {
		throw new Error(`متغيرات البيئة المطلوبة غير موجودة: ${missing.join(', ')}`);
	}
}

export { rootDirectory };
