import { readFile, writeFile } from 'node:fs/promises';
import { URL } from 'node:url';

const pkgJsonPath = new URL('../package.json', import.meta.url);
const pkgJson = JSON.parse(await readFile(pkgJsonPath, 'utf8'));

pkgJson.name = 'create-discord-app';

await writeFile(pkgJsonPath, JSON.stringify(pkgJson, null, '\t') + '\n');

const readmePath = new URL('../README.md', import.meta.url);
const readme = await readFile(readmePath, 'utf8');

await writeFile(readmePath, readme.replaceAll('create discord-bot', 'create discord-app'));
