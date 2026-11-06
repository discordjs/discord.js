import process from 'node:process';
import { describe, expect, test } from 'vitest';
import { runCommand } from '../src/util/runCommand.js';

describe('Bun Shell commands', () => {
	test('preserves spaces, multiline arguments, and shell syntax as literal values', async () => {
		const value = 'package name; $(echo unintended) "quoted"\nsecond line';
		expect(await runCommand('printf', ['%s', value], process.cwd())).toBe(value);
	});
	test('retains command diagnostics when a shell command fails', async () => {
		await expect(
			runCommand(
				'bun',
				['-e', 'console.log("command output"); console.error("failure reason"); process.exit(7)'],
				process.cwd(),
			),
		).rejects.toThrow(/exited with code 7\ncommand output\n\nfailure reason/);
	});
});
