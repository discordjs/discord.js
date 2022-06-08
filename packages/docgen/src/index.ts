#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import { join, basename, extname, dirname, relative } from 'node:path';
import { createCommand } from 'commander';
import jsdoc2md from 'jsdoc-to-markdown';
import { Application, DeclarationReflection, TSConfigReader } from 'typedoc';
import { Documentation } from './documentation.js';
import type { ChildTypes, CustomDocs, RootTypes } from './interfaces/index.js';
import packageFile from '../package.json';

interface CLIOptions {
	input: string[];
	custom: string;
	root: string;
	output: string;
	typescript: boolean;
}

interface CustomFiles {
	id?: string;
	name: string;
	path?: string;
	files: {
		id?: string;
		name: string;
		path: string;
	}[];
}

const command = createCommand()
	.version(packageFile.version)
	.option('-i, --input <string...>', 'Source directories to parse JSDocs in')
	.option('-c, --custom <string>', 'Custom docs definition file to use')
	.option('-r, --root [string]', 'Root directory of the project', '.')
	.option('-o, --output <string>', 'Path to output file')
	.option('--typescript', '', false);

const program = command.parse(process.argv);
const options = program.opts<CLIOptions>();

let data: (RootTypes & ChildTypes)[] | DeclarationReflection[] = [];
if (options.typescript) {
	console.log('Parsing Typescript in source files...');
	const app = new Application();
	app.options.addReader(new TSConfigReader());
	app.bootstrap({ entryPoints: options.input });
	const project = app.convert();
	if (project) {
		// @ts-expect-error
		data = app.serializer.toObject(project).children!;
		console.log(`${data.length} items parsed.`);
	}
} else {
	console.log('Parsing JSDocs in source files...');
	data = jsdoc2md.getTemplateDataSync({ files: options.input }) as (RootTypes & ChildTypes)[];
	console.log(`${data.length} JSDoc items parsed.`);
}

const custom: Record<string, CustomDocs> = {};
if (options.custom) {
	console.log('Loading custom docs files...');
	const customDir = dirname(options.custom);
	const file = readFileSync(options.custom, 'utf-8');
	const data = JSON.parse(file) as CustomFiles[];

	for (const category of data) {
		const categoryId = category.id ?? category.name.toLowerCase();
		const dir = join(customDir, category.path ?? categoryId);
		custom[categoryId] = {
			name: category.name || category.id,
			files: {},
		};

		for (const f of category.files) {
			const fileRootPath = join(dir, f.path);
			const extension = extname(f.path);
			const fileId = f.id ?? basename(f.path, extension);
			const fileData = readFileSync(fileRootPath, 'utf-8');
			custom[categoryId]!.files[fileId] = {
				name: f.name,
				type: extension.toLowerCase().replace(/^\./, ''),
				content: fileData,
				path: relative(options.root, fileRootPath).replace(/\\/g, '/'),
			};
		}
	}

	const fileCount = Object.keys(custom)
		.map((k) => Object.keys(custom[k]!))
		.reduce((prev, c) => prev + c.length, 0);
	const categoryCount = Object.keys(custom).length;
	console.log(
		`${fileCount} custom docs file${fileCount === 1 ? '' : 's'} in ` +
			`${categoryCount} categor${categoryCount === 1 ? 'y' : 'ies'} loaded.`,
	);
}

console.log(`Serializing documentation with format version ${Documentation.FORMAT_VERSION}...`);
const docs = new Documentation(data, options, custom);

if (options.output) {
	console.log(`Writing to ${options.output}...`);
	writeFileSync(options.output, JSON.stringify(docs.serialize()));
}
console.log('Done!');
