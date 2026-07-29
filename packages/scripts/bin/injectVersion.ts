import { readFile, stat, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const packageConfig = await import(join(process.cwd(), 'package.json'), { with: { type: 'json' } });

const filenames = ['index.js', 'index.mjs', 'index.cjs'];

for (const filename of filenames) {
	const path = join(process.cwd(), 'dist', filename);
	if ((await stat(path).catch(() => null))?.isFile()) {
		const data = await readFile(path, 'utf8');
		await writeFile(path, data.replaceAll(/\[VI]{{inject}}\[\/VI]/g, packageConfig.default.version));
	}
}
