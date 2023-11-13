import { readdir, readFile, writeFile, opendir } from 'node:fs/promises';
import process from 'node:process';

const importPattern = process.argv[2];

const files = await readdir('dist');

const filesToCorrect = files.filter((file) => file.startsWith(importPattern));

if (filesToCorrect.length === 0) {
	process.exit(0);
}

if (filesToCorrect.length > 1) {
	console.warn(
		`Found ${filesToCorrect.length} files to correct. This is unexpected. Please make the import pattern more specific. Received: ${importPattern}`,
	);
	console.warn('Files to correct:', filesToCorrect);
	console.warn('Correcting first file only.');
}

const fileToCorrect = filesToCorrect[0];

// Copy the input file to its mts counterpart
console.log('Copying', fileToCorrect, 'to', fileToCorrect.replace('d.ts', 'd.mts'));
const originalContent = await readFile(`dist/${fileToCorrect}`, 'utf8');
const newPath = fileToCorrect.replace('d.ts', 'd.mts');
await writeFile(`dist/${newPath}`, originalContent);

await walkDirectory(fileToCorrect.replace('d.ts', 'js'));

/**
 * @param {string} importFileName
 * @param {string} [path]
 */
async function walkDirectory(importFileName, path = 'dist') {
	for await (const entry of await opendir(path)) {
		if (entry.isDirectory()) {
			await walkDirectory(importFileName, `${path}/${entry.name}`);
		}

		// We only want to change d.mts files
		if (!entry.name.endsWith('.d.mts')) {
			continue;
		}

		console.log('Correcting', `${path}/${entry.name}`);
		const content = await readFile(`${path}/${entry.name}`, 'utf8');
		const newContent = content.replaceAll(importFileName, importFileName.replace('.js', '.mjs'));
		await writeFile(`${path}/${entry.name}`, newContent);
	}
}
