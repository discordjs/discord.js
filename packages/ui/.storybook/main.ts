import type { StorybookConfig } from '@storybook/react-vite';

export default {
	stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
	addons: [
		'@storybook/addon-links',
		'@storybook/addon-essentials',
		'@storybook/addon-interactions',
		'@storybook/addon-styling',
	],
	core: {
		builder: '@storybook/builder-vite',
	},
	framework: {
		name: '@storybook/react-vite',
		options: {},
	},
	docs: {
		autodocs: 'tag',
	},
} satisfies StorybookConfig;
