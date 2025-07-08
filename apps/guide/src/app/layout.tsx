import { Analytics } from '@vercel/analytics/react';
import { RootProvider } from 'fumadocs-ui/provider';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import type { Metadata, Viewport } from 'next';
import type { PropsWithChildren } from 'react';
import { Body } from '@/app/layout.client';
import { ENV } from '@/util/env';

import '@/styles/base.css';

export const viewport: Viewport = {
	themeColor: [
		{ media: '(prefers-color-scheme: light)', color: '#fbfbfb' },
		{ media: '(prefers-color-scheme: dark)', color: '#1a1a1e' },
	],
	colorScheme: 'light dark',
};

export const metadata: Metadata = {
	metadataBase: new URL(ENV.IS_LOCAL_DEV ? `http://localhost:${ENV.PORT}` : 'https://next.discordjs.guide'),
	title: {
		template: '%s | discord.js',
		default: 'discord.js',
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

	appleWebApp: {
		title: 'discord.js',
	},

	applicationName: 'discord.js',

	openGraph: {
		siteName: 'discord.js',
		type: 'website',
		title: 'discord.js',
		images: 'https://discordjs.dev/api/open-graph.png',
	},

	twitter: {
		card: 'summary_large_image',
		creator: '@iCrawlToGo',
	},

	other: {
		'msapplication-TileColor': '#1a1a1e',
	},
};

export default async function RootLayout({ children }: PropsWithChildren) {
	return (
		<html className={`${GeistSans.variable} ${GeistMono.variable} antialiased`} lang="en" suppressHydrationWarning>
			<Body>
				<RootProvider>{children}</RootProvider>
				<Analytics />
			</Body>
		</html>
	);
}
