import { readFile } from 'node:fs/promises';
import { generateAllIndices } from '../../../../discord.js/packages/scripts/src';
// import { generateAllIndices } from '@discordjs/scripts';

console.info('Generating all indices...');

type FetchPackageVersion = () => Promise<string[]>;
type FetchPackageVersionDocs = (pkg: string, version: string) => Promise<string>;
const fetchPackageVersions: FetchPackageVersion = async () => ['main'];
const fetchPackageVersionDocs: FetchPackageVersionDocs = async (pkg, version) => {
	console.log(`Fetching data for ${pkg} ${version}...`);
	return JSON.parse(await readFile(`${process.cwd()}/../../../docs/${pkg}/${version}.api.json`, 'utf8'));
}

await generateAllIndices({
	fetchPackageVersions,
	fetchPackageVersionDocs
});

console.info('Generated all indices.');
