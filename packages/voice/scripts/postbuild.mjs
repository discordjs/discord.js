import { readFile, writeFile } from 'node:fs/promises';

const data = await readFile('./dist/index.mjs', 'utf-8');
await writeFile(
	'./dist/index.mjs',
	`import{createRequire as topLevelCreateRequire}from"module";const require=topLevelCreateRequire(import.meta.url);${data}`,
);
