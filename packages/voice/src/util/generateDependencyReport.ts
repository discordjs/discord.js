/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
import { resolve, dirname } from 'node:path';
import prism from 'prism-media';

/**
 * Tries to find the package.json file for a given module.
 *
 * @param dir - The directory to look in
 * @param packageName - The name of the package to look for
 * @param depth - The maximum recursion depth
 */
function findPackageJSON(
	dir: string,
	packageName: string,
	depth: number,
): { name: string; version: string } | undefined {
	if (depth === 0) return undefined;
	const attemptedPath = resolve(dir, './package.json');
	try {
		const pkg = require(attemptedPath);
		if (pkg.name !== packageName) throw new Error('package.json does not match');
		return pkg;
	} catch {
		return findPackageJSON(resolve(dir, '..'), packageName, depth - 1);
	}
}

/**
 * Tries to find the version of a dependency.
 *
 * @param name - The package to find the version of
 */
function version(name: string): string {
	try {
		const pkg =
			name === '@discordjs/voice'
				? require('../../package.json')
				: findPackageJSON(dirname(require.resolve(name)), name, 3);
		return pkg?.version ?? 'not found';
	} catch {
		return 'not found';
	}
}

/**
 * Generates a report of the dependencies used by the \@discordjs/voice module.
 * Useful for debugging.
 */
export function generateDependencyReport() {
	const report = [];
	const addVersion = (name: string) => report.push(`- ${name}: ${version(name)}`);
	// general
	report.push('Core Dependencies');
	addVersion('@discordjs/voice');
	addVersion('prism-media');
	report.push('');

	// opus
	report.push('Opus Libraries');
	addVersion('@discordjs/opus');
	addVersion('opusscript');
	report.push('');

	// encryption
	report.push('Encryption Libraries');
	addVersion('sodium-native');
	addVersion('sodium');
	addVersion('libsodium-wrappers');
	addVersion('tweetnacl');
	report.push('');

	// ffmpeg
	report.push('FFmpeg');
	try {
		const info = prism.FFmpeg.getInfo();
		report.push(`- version: ${info.version}`);
		report.push(`- libopus: ${info.output.includes('--enable-libopus') ? 'yes' : 'no'}`);
	} catch {
		report.push('- not found');
	}

	return ['-'.repeat(50), ...report, '-'.repeat(50)].join('\n');
}
