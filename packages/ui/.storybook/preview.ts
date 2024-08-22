import type { Preview } from '@storybook/react';
import { withThemeByClassName } from '@storybook/addon-styling';

import '@unocss/reset/tailwind-compat.css';
import './preview.css';
import 'virtual:uno.css';

export default {
	parameters: {
		actions: { argTypesRegex: '^on[A-Z].*' },
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/,
			},
		},
	},
} satisfies Preview;

export const decorators = [
	withThemeByClassName({
		themes: {
			light: 'bg-light-600',
			dark: 'dark bg-dark-600',
		},
		defaultTheme: 'light',
	}),
];
