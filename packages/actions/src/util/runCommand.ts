import process from 'node:process';
import { $ } from 'bun';

export async function runCommand(command: string, args: string[], cwd: string) {
	const result = await $`${[command, ...args]}`
		.cwd(cwd)
		.env({ ...process.env, FORCE_COLOR: '0', HUSKY: '0', pnpm_config_verify_deps_before_run: 'false' })
		.quiet()
		.nothrow();
	if (result.exitCode)
		throw new Error(
			`${command} exited with code ${result.exitCode}\n${result.stdout.toString()}\n${result.stderr.toString()}`,
		);
	return result.stdout.toString().trim();
}
