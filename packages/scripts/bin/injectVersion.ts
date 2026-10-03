import { readFile, stat, writeFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { cwd } from 'node:process';
import { pathToFileURL } from 'node:url';

const packageConfig = await import(pathToFileURL(join(cwd(), 'package.json')).href, { with: { type: 'json' } });

async function handleDirectory(directory: string) {
	const filenames = await readdir(directory).then((files) => files.filter((file) => file.endsWith('js')));

	for (const filename of filenames) {
		const path = join(directory, filename);
		const stats = await stat(path).catch(() => null);
		if (stats?.isFile()) {
			const data = await readFile(path, 'utf8');
			await writeFile(path, data.replaceAll('[VI]{{inject}}[/VI]', packageConfig.default.version));
		} else if (stats?.isDirectory()) {
			await handleDirectory(path);
		}
	}
}

await handleDirectory(join(cwd(), 'dist'));
