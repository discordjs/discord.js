import { Analytics } from '@vercel/analytics/react';
import type { Metadata } from 'next/types';
import type { PropsWithChildren } from 'react';
import { Providers } from './providers';
import { DESCRIPTION } from '~/util/constants';
import { inter, jetBrainsMono } from '~/util/fonts';

import '@unocss/reset/tailwind-compat.css';
import '~/styles/unocss.css';
import '~/styles/cmdk.css';
import '@code-hike/mdx/styles.css';
import '~/styles/ch.css';
import '~/styles/main.css';

export const metadata: Metadata = {
	title: 'discord.js',
	description: DESCRIPTION,
	viewport: {
		minimumScale: 1,
		initialScale: 1,
		width: 'device-width',
	},
	icons: {
		other: [
			{
				url: '/favicon-32x32.png',
				sizes: '32x32',
				type: 'image/png',
			},
			{
				url: '/favicon-16x16.png',
				sizes: '16x16',
				type: 'image/png',
			},
		],
		apple: [
			'/apple-touch-icon.png',
			{
				url: '/safari-pinned-tab.svg',
				rel: 'mask-icon',
			},
		],
	},

	manifest: '/site.webmanifest',

	themeColor: [
		{ media: '(prefers-color-scheme: light)', color: '#f1f3f5' },
		{ media: '(prefers-color-scheme: dark)', color: '#181818' },
	],
	colorScheme: 'light dark',

	appleWebApp: {
		title: 'discord.js',
	},

	applicationName: 'discord.js',

	openGraph: {
		siteName: 'discord.js',
		type: 'website',
		title: 'discord.js',
		description: DESCRIPTION,
		images: 'https://discordjs.dev/api/open-graph.png',
	},

	twitter: {
		card: 'summary_large_image',
		creator: '@iCrawlToGo',
	},

	other: {
		'msapplication-TileColor': '#090a16',
	},
};

export default function RootLayout({ children }: PropsWithChildren) {
	return (
		<html className={`${inter.variable} ${jetBrainsMono.variable}`} lang="en" suppressHydrationWarning>
			<body className="dark:bg-dark-600 bg-light-600 dark:text-light-900">
				<Providers>{children}</Providers>
				<Analytics />
			</body>
		</html>
	);
}
