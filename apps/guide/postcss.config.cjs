module.exports = {
	plugins: {
		'@unocss/postcss': {
			content: ['src/**/*.tsx', 'contentlayer.config.ts', '../../packages/ui/src/lib/components/**/*.tsx'],
		},
	},
};
