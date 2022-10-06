import { argv, exit } from 'node:process';
import { createPackage } from '../dist/index.mjs';

const packageName = argv[2];

if (!packageName) {
	console.error('Expected package name as first argument');
	exit(1);
}

console.log(`Creating package @discordjs/${packageName}...`);
await createPackage(packageName);
console.log('Done!');
