import { Analytics } from '@vercel/analytics/react';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import type { Metadata, Viewport } from 'next';
import type { PropsWithChildren } from 'react';
import { LocalizedStringProvider } from 'react-aria-components/i18n';
import { DESCRIPTION } from '~/util/constants';
import { ENV } from '~/util/env';
import { Providers } from './providers';

import '~/styles/main.css';
import 'overlayscrollbars/overlayscrollbars.css';

export const viewport: Viewport = {
	themeColor: [
		{ media: '(prefers-color-scheme: light)', color: '#ffffff' },
		{ media: '(prefers-color-scheme: dark)', color: '#121212' },
	],
	colorScheme: 'light dark',
};

export const metadata: Metadata = {
	metadataBase: new URL(
		process.env.NEXT_PUBLIC_LOCAL_DEV === 'true'
			? `http://localhost:${process.env.PORT ?? 3_000}`
			: 'https://discord.js.org',
	),
	title: {
		template: '%s | discord.js',
		default: 'discord.js',
	},
	description: DESCRIPTION,
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
		description: DESCRIPTION,
		images: 'https://discordjs.dev/api/open-graph.png',
	},

	twitter: {
		card: 'summary_large_image',
		creator: '@iCrawlToGo',
	},

	other: {
		'msapplication-TileColor': '#121212',
	},
};

export default async function RootLayout({ children }: PropsWithChildren) {
	return (
		<html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} antialiased`} suppressHydrationWarning>
			<body className="relative bg-white dark:bg-[#121212]">
				<LocalizedStringProvider locale="en-US" />
				<Providers>
					{ENV.IS_LOCAL_DEV ? (
						<div className="sticky top-0 z-10 flex h-10 place-content-center place-items-center bg-red-500 text-lg text-white">
							Local test environment
						</div>
					) : null}
					{ENV.IS_PREVIEW ? (
						<div className="sticky top-0 z-10 flex h-10 place-content-center place-items-center bg-red-500 text-lg text-white">
							Preview deployment
						</div>
					) : null}
					{children}
				</Providers>
				<Analytics />
			</body>
		</html>
	);
}
