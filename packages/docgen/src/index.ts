import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, extname, basename, relative } from 'node:path';
import jsdoc2md from 'jsdoc-to-markdown';
import { type DeclarationReflection, Application, TSConfigReader } from 'typedoc';
import type { CLIOptions } from './cli';
import { Documentation } from './documentation.js';
import type { RootTypes, ChildTypes, CustomDocs } from './interfaces';

interface CustomFiles {
	files: {
		id?: string;
		name: string;
		path: string;
	}[];
	id?: string;
	name: string;
	path?: string;
}

export function build({ input, custom: customDocs, root, output, typescript }: CLIOptions) {
	let data: (ChildTypes & RootTypes)[] | DeclarationReflection[] = [];
	if (typescript) {
		console.log('Parsing Typescript in source files...');
		const app = new Application();
		app.options.addReader(new TSConfigReader());
		app.bootstrap({ entryPoints: input });
		const project = app.convert();
		if (project) {
			// @ts-expect-error: Types are lost with this method
			data = app.serializer.toObject(project).children!;
			console.log(`${data.length} items parsed.`);
		}
	} else {
		console.log('Parsing JSDocs in source files...');
		// eslint-disable-next-line n/no-sync
		data = jsdoc2md.getTemplateDataSync({ files: input }) as (ChildTypes & RootTypes)[];
		console.log(`${data.length} JSDoc items parsed.`);
	}

	const custom: Record<string, CustomDocs> = {};
	if (customDocs) {
		console.log('Loading custom docs files...');
		const customDir = dirname(customDocs);
		const file = readFileSync(customDocs, 'utf8');
		const data = JSON.parse(file) as CustomFiles[];

		for (const category of data) {
			const categoryId = category.id ?? category.name.toLowerCase();
			const dir = join(customDir, category.path ?? categoryId);
			custom[categoryId] = {
				name: category.name || category.id!,
				files: {},
			};

			for (const file of category.files) {
				const fileRootPath = join(dir, file.path);
				const extension = extname(file.path);
				const fileId = file.id ?? basename(file.path, extension);
				const fileData = readFileSync(fileRootPath, 'utf8');
				custom[categoryId]!.files[fileId] = {
					name: file.name,
					type: extension.toLowerCase().replace(/^\./, ''),
					content: fileData,
					path: relative(root, fileRootPath).replaceAll('\\', '/'),
				};
			}
		}

		const fileCount = Object.keys(custom)
			.map((key) => Object.keys(custom[key]!))
			.reduce((prev, content) => prev + content.length, 0);
		const categoryCount = Object.keys(custom).length;
		console.log(
			`${fileCount} custom docs file${fileCount === 1 ? '' : 's'} in ` +
				`${categoryCount} categor${categoryCount === 1 ? 'y' : 'ies'} loaded.`,
		);
	}

	console.log(`Serializing documentation with format version ${Documentation.FORMAT_VERSION}...`);
	const docs = new Documentation(data, { input, custom: customDocs, root, output, typescript }, custom);

	if (output) {
		console.log(`Writing to ${output}...`);
		writeFileSync(output, JSON.stringify(docs.serialize()));
	}

	console.log('Done!');
}
