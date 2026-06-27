import { readFile, writeFile } from 'node:fs/promises';

const data = await readFile('./dist/index.js', 'utf8');
await writeFile(
	'./dist/index.js',
	`import { createRequire as topLevelCreateRequire } from "module";
const require = topLevelCreateRequire(import.meta.url);
${data}`,
);
