import type { StorybookConfig } from '@storybook/react-vite';

export default {
	stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
	addons: ['@storybook/addon-links', '@storybook/addon-themes', '@storybook/addon-docs'],
	core: {
		builder: '@storybook/builder-vite',
	},
	framework: {
		name: '@storybook/react-vite',
		options: {},
	},
} satisfies StorybookConfig;
