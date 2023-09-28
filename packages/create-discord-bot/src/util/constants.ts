/**
 * The default package manager.
 */
export const DEFAULT_PACKAGE_MANAGER = 'npm' as const;

/**
 * The default project name.
 */
export const DEFAULT_PROJECT_NAME = 'my-bot' as const;

/**
 * The supported package managers.
 */
export const PACKAGE_MANAGERS = ['npm', 'pnpm', 'yarn', 'bun', 'deno'] as const;

/**
 * The URL to the guide.
 */
export const GUIDE_URL = 'https://guide.discordjs.dev' as const;
