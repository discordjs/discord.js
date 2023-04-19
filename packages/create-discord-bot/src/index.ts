#!/usr/bin/env node

// eslint-disable-next-line n/shebang
import { execSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { URL } from 'node:url';
import chalk from 'chalk';
import { program } from 'commander';

// A directory must be specified.
program
	.description('Create a template bot.')
	.argument('<directory>', 'The directory where this will be created.')
	.parse();

const [directory] = program.args;

if (!directory) {
	console.error(chalk.red('Please specify the project directory!'));
	process.exit(1);
}

// Resolve the root of the project.
const root = path.resolve(directory);
const name = path.basename(root);

// Ensure the directory exists.
if (!existsSync(root)) mkdirSync(root, { recursive: true });
console.log(`Creating ${name} in ${chalk.green(root)}.`);

// Copy template!
cpSync(new URL('../template', import.meta.url), root, { recursive: true });

// Install dependencies, because we're so nice.
console.log('Installing dependencies...');
process.chdir(root);
execSync('npm install');

// Completion feedback.
console.log(chalk.green('All done! Be sure to check out the discord.js guide too!'));
