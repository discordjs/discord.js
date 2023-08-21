import { execSync } from 'node:child_process';
import process from 'node:process';
import { yellow } from 'picocolors';
import { DEFAULT_PACKAGE_MANAGER } from '../util/constants.js';

/**
 * A union of supported package managers.
 */
export type PackageManager = 'bun' | 'deno' | 'npm' | 'pnpm' | 'yarn';

/**
 * Resolves the package manager from `npm_config_user_agent`.
 */
export function resolvePackageManager(): PackageManager {
	const npmConfigUserAgent = process.env.npm_config_user_agent;

	// If this is not present, return the default package manager.
	if (!npmConfigUserAgent) {
		return DEFAULT_PACKAGE_MANAGER;
	}

	if (npmConfigUserAgent.startsWith('npm')) {
		return 'npm';
	}

	if (npmConfigUserAgent.startsWith('yarn')) {
		return 'yarn';
	}

	if (npmConfigUserAgent.startsWith('pnpm')) {
		return 'pnpm';
	}

	console.error(
		yellow(
			`Detected an unsupported package manager (${npmConfigUserAgent}). Falling back to ${DEFAULT_PACKAGE_MANAGER}.`,
		),
	);

	// Fallback to the default package manager.
	return DEFAULT_PACKAGE_MANAGER;
}

/**
 * Installs with a provided package manager.
 *
 * @param packageManager - The package manager to use
 */
export function install(packageManager: PackageManager) {
	let installCommand: string[] | string = `${packageManager} install`;

	console.log(`Installing dependencies with ${packageManager}...`);

	switch (packageManager) {
		case 'yarn':
			console.log();
			installCommand = [
				`${packageManager} set version stable`,
				`${packageManager} config set nodeLinker node-modules`,
				`${packageManager} config set logFilters --json '[{ "code": "YN0002", "level": "discard" }, { "code": "YN0013", "level": "discard" }, { "code": "YN0032", "level": "discard" }, { "code": "YN0060", "level": "discard" }]'`,
				`${packageManager} plugin import interactive-tools`,
				`${packageManager} plugin import workspace-tools`,
				installCommand,
			];
			break;
		case 'deno':
			installCommand = `${packageManager} cache --reload src/index.ts`;
			break;
		case 'pnpm':
		case 'bun':
			console.log();
			break;
		default:
			break;
	}

	const env = {
		...process.env,
		ADBLOCK: '1',
		NODE_ENV: 'development',
		DISABLE_OPENCOLLECTIVE: '1',
	};

	if (Array.isArray(installCommand)) {
		for (const [index, command] of installCommand.entries()) {
			if (index === installCommand.length - 1) {
				execSync(command, {
					stdio: 'inherit',
					env,
				});

				break;
			}

			execSync(command, {
				stdio: 'ignore',
				env,
			});
		}

		return;
	}

	execSync(installCommand, {
		stdio: 'inherit',
		env,
	});
}
