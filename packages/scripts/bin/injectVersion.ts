import { readFile, stat, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { cwd } from 'node:process';
import { pathToFileURL } from 'node:url';

const packageConfig = await import(pathToFileURL(join(cwd(), 'package.json')).href, { with: { type: 'json' } });

const filenames = ['index.js', 'index.mjs', 'index.cjs'];

for (const filename of filenames) {
	const path = join(cwd(), 'dist', filename);
	if ((await stat(path).catch(() => null))?.isFile()) {
		const data = await readFile(path, 'utf8');
		await writeFile(path, data.replaceAll('[VI]{{inject}}[/VI]', packageConfig.default.version));
	}
}
