import { readFile, writeFile } from 'node:fs/promises';
import { parse as parseYAML, stringify as stringifyYAML } from 'yaml';

interface LabelerData {
	color: string;
	name: string;
}

const labelsYamlFile = new URL('../../../../.github/labels.yml', import.meta.url);

const content = await readFile(labelsYamlFile, 'utf8');

const labelsYAML = parseYAML(content) as LabelerData[];
labelsYAML.sort((a, b) => a.name.localeCompare(b.name));

await writeFile(labelsYamlFile, stringifyYAML(labelsYAML));
