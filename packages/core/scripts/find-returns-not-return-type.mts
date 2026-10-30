import { glob, readFile } from 'node:fs/promises';

const cwd = new URL('../src/api/', import.meta.url);
const results: string[] = [];

for await (const file of glob('**/*.ts', { cwd })) {
	const content = await readFile(new URL(file, cwd), { encoding: 'utf-8' });

	const matches = content.matchAll(/as Promise<(?<returnType>\w+)>/g);

	for (const match of matches) {
		const returnType = match.groups!.returnType!;

		if (!returnType.startsWith('REST') || !returnType.includes('Result')) {
			results.push(`in file core/src/api/${file}: ${returnType}`);
		}
	}
}

if (results.length > 0) {
	console.warn('Found return types that are not REST return types:');

	for (const result of results) {
		console.warn(`  - ${result}`);
	}
} else {
	console.log('No return types that are not REST return types found');
}
