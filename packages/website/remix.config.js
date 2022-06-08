/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
	serverBuildTarget: 'vercel',
	server: process.env.NODE_ENV === 'development' ? undefined : './src/server.ts',
	appDirectory: 'src',
	ignoredRouteFiles: ['**/.*', '**/*.css', '**/*.test.{js,jsx,ts,tsx}'],
};
