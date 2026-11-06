import { describe, expect, test, vi } from 'vitest';
import { generateReleaseTree } from '../src/releasePackages/generateReleaseTree.js';

vi.mock('bun', () => ({
	$(strings: TemplateStringsArray) {
		if (strings[0]!.startsWith('pnpm list')) {
			return {
				json: async () => [
					{ name: 'shared', version: '1.0.0' },
					{ name: 'unrelated', version: '1.0.0' },
					{ name: 'dependency', version: '1.0.0', dependencies: { shared: {} } },
					{ name: 'root', version: '1.0.0', dependencies: { dependency: {} } },
				],
			};
		}

		return { text: async () => 'abc123' };
	},
	file: () => ({ text: async () => '' }),
}));

describe('Release exclusions', () => {
	test.each([undefined, 'all', 'root'])('retains required dependencies when selecting %s', async (selection) => {
		const tree = await generateReleaseTree(true, undefined, selection, ['shared', 'dependency', 'unrelated']);
		expect(tree.map((branch) => branch.map((entry) => entry.name))).toEqual([['shared'], ['dependency'], ['root']]);
	});

	test('single-package selection takes precedence over exclusions', async () => {
		const tree = await generateReleaseTree(true, undefined, 'shared', ['shared']);
		expect(tree.flat().map((entry) => entry.name)).toEqual(['shared']);
	});

	test('does not restore excluded packages when no retained package needs them', async () => {
		expect(await generateReleaseTree(true, undefined, 'all', ['root', 'dependency', 'shared', 'unrelated'])).toEqual(
			[],
		);
	});

	test('retains dependencies in order when they are not excluded', async () => {
		const tree = await generateReleaseTree(true, undefined, 'root');
		expect(tree.map((branch) => branch.map((entry) => entry.name))).toEqual([['shared'], ['dependency'], ['root']]);
	});
});
