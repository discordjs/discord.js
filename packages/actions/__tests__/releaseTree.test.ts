import { describe, expect, test } from 'vitest';
import { buildReleaseTree, selectReleaseTree, type ReleaseEntry } from '../src/releasePackages/releaseTree.js';

const entries: ReleaseEntry[] = [
	{ name: 'shared', version: '1.0.0' },
	{ name: 'unrelated', version: '1.0.0' },
	{ name: 'dep-a', version: '2.0.0', dependsOn: ['shared'] },
	{ name: 'dep-b', version: '3.0.0', dependsOn: ['shared'] },
	{ name: 'root-a', version: '4.0.0', dependsOn: ['dep-a'] },
	{ name: 'root-b', version: '5.0.0', dependsOn: ['dep-b'] },
];

describe('Release dependency selection', () => {
	test('selects all artifact roots plus their dependencies in order, without unrelated packages or duplicates', () => {
		const tree = selectReleaseTree(entries, { 'root-a': '4.0.0', 'root-b': '5.0.0' });
		expect(tree.map((branch) => branch.map((entry) => entry.name))).toEqual([
			['shared'],
			['dep-a', 'dep-b'],
			['root-a', 'root-b'],
		]);
	});
	test('retains dependencies outside the artifact for the existing registry check to skip or publish', () => {
		expect(
			selectReleaseTree(entries, { 'root-a': '4.0.0' })
				.flat()
				.map((entry) => entry.name),
		).toEqual(['shared', 'dep-a', 'root-a']);
	});
	test('rejects a missing package or a different checked-out version', () => {
		expect(() => selectReleaseTree(entries, { missing: '1.0.0' })).toThrow('does not match');
		expect(() => selectReleaseTree(entries, { 'root-a': '9.0.0' })).toThrow('does not match');
	});
	test('preserves full manual release ordering and rejects dependency cycles', () => {
		expect(buildReleaseTree(entries).flat()).toHaveLength(6);
		expect(() =>
			buildReleaseTree([
				{ name: 'a', version: '1.0.0', dependsOn: ['b'] },
				{ name: 'b', version: '1.0.0', dependsOn: ['a'] },
			]),
		).toThrow("can't be released");
	});
});
