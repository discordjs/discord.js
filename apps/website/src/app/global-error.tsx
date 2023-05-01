'use client';

import { Analytics } from '@vercel/analytics/react';
import type { Metadata } from 'next';
import { Providers } from './providers';
import { DESCRIPTION } from '~/util/constants';
import { inter } from '~/util/fonts';

import '@unocss/reset/tailwind-compat.css';
import '~/styles/unocss.css';
import '~/styles/cmdk.css';
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
		{ media: '(prefers-color-scheme: dark)', color: '#1c1c1e' },
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
		'msapplication-TileColor': '#1c1c1e',
	},
};

export default function GlobalError({ error }: { error: Error }) {
	console.error(error);

	return (
		<html className={inter.variable} lang="en" suppressHydrationWarning>
			<body className="bg-light-600 dark:bg-dark-600 dark:text-light-900">
				<Providers>
					<main className="mx-auto max-w-2xl min-h-screen">
						<div className="mx-auto max-w-lg min-h-screen flex flex-col place-content-center place-items-center gap-8 px-8 py-16 lg:px-6 lg:py-0">
							<h1 className="text-[9rem] font-black leading-none md:text-[12rem]">500</h1>
							<h2 className="text-[2rem] md:text-[3rem]">Error.</h2>
						</div>
					</main>
				</Providers>
				<Analytics />
			</body>
		</html>
	);
}
