import process from 'node:process';
import { getInput } from '@actions/core';
import { generateReleaseTree } from './generateReleaseTree.js';
import { releasePackage } from './releasePackage.js';

const argInput = process.argv[2];
const useableArg = argInput === 'discord.js' || argInput?.startsWith('@discordjs/');
const packageName = getInput('package') || useableArg ? argInput : '';

const tree = await generateReleaseTree(packageName);
for (const branch of tree) {
	console.log(`Releasing ${branch.map((entry) => `${entry.name}@${entry.version}`).join(', ')}`);
	await Promise.all(branch.map(async (release) => releasePackage(release)));
}

console.log(
	`Successfully released ${tree.map((branch) => branch.map((entry) => `${entry.name}@${entry.version}`).join(', ')).join(', ')}`,
);
