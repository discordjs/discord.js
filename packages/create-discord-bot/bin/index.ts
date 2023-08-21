#!/usr/bin/env node

// eslint-disable-next-line n/shebang
import process from 'node:process';
import { Option, program } from 'commander';
import { red, yellow, green } from 'picocolors';
import prompts from 'prompts';
import validateProjectName from 'validate-npm-package-name';
import packageJSON from '../package.json' assert { type: 'json' };
import { createDiscordBot } from '../src/create-discord-bot.js';
import { resolvePackageManager } from '../src/helpers/packageManager.js';
import { DEFAULT_PROJECT_NAME, PACKAGE_MANAGERS } from '../src/util/constants.js';

let projectDirectory = '';

const handleSigTerm = () => process.exit(0);

process.on('SIGINT', handleSigTerm);
process.on('SIGTERM', handleSigTerm);

// https://github.com/vercel/next.js/blob/canary/packages/create-next-app/index.ts#L24-L32
const onPromptState = (state: any) => {
	if (state.aborted) {
		// If we don't re-enable the terminal cursor before exiting
		// the program, the cursor will remain hidden
		process.stdout.write('\u001B[?25h');
		process.stdout.write('\n');
		process.exit(1);
	}
};

program
	.name(packageJSON.name)
	.version(packageJSON.version)
	.description('Create a basic discord.js bot.')
	.argument('[directory]', 'What is the name of the directory you want to create this project in?')
	.usage(`${green('<directory>')}`)
	.action((directory) => {
		projectDirectory = directory;
	})
	.option('--typescript', 'Whether to use the TypeScript template.')
	.option('--javascript', 'Whether to use the JavaScript template.')
	.addOption(
		new Option('--packageManager <packageManager>', 'The package manager to use.')
			.choices(PACKAGE_MANAGERS)
			.default(resolvePackageManager()),
	)
	.allowUnknownOption()
	.parse();

// eslint-disable-next-line prefer-const
let { typescript, javascript, packageManager } = program.opts();

if (!projectDirectory) {
	projectDirectory = (
		await prompts({
			onState: onPromptState,
			type: 'text',
			name: 'directory',
			initial: DEFAULT_PROJECT_NAME,
			message: 'What is the name of the directory you want to create this project in?',
			validate: (directory) => {
				// We'll use the directory name as the project name. Check npm name validity.
				const validationResult = validateProjectName(directory);

				if (!validationResult.validForNewPackages) {
					const errors = [];

					for (const error of [...(validationResult.errors ?? []), ...(validationResult.warnings ?? [])]) {
						errors.push(red(`- ${error}`));
					}

					return red(
						`Cannot create a project named ${yellow(
							`"${directory}"`,
						)} due to npm naming restrictions.\n\nErrors:\n${errors.join('\n')}\n\n${red(
							'\nSee https://docs.npmjs.com/cli/configuring-npm/package-json for more details.',
						)}}`,
					);
				}

				return true;
			},
		})
	).directory;
}

const deno = packageManager === 'deno';
if (!deno && typescript === undefined && javascript === undefined) {
	const { useTypescript } = await prompts({
		onState: onPromptState,
		type: 'toggle',
		name: 'useTypescript',
		message: 'Do you want to use TypeScript?',
		initial: true,
		active: 'Yes',
		inactive: 'No',
	});

	typescript = useTypescript;
}

await createDiscordBot({ typescript, directory: projectDirectory, packageManager });
