/**
 * @type {import('@babel/core').TransformOptions}
 */
module.exports = {
	parserOpts: { strictMode: true },
	sourceMaps: 'inline',
	presets: [
		[
			'@babel/preset-env',
			{
				targets: { node: 'current' },
				modules: 'commonjs',
			},
		],
		[
			'@babel/preset-typescript',
			{
				allowDeclareFields: true,
			},
		],
	],
	plugins: ['babel-plugin-transform-typescript-metadata', ['@babel/plugin-proposal-decorators', { legacy: true }]],
};
