import { Analytics } from '@vercel/analytics/react';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import type { Metadata, Viewport } from 'next';
import type { PropsWithChildren } from 'react';
import { DESCRIPTION } from '@/util/constants';
import { ENV } from '@/util/env';
import { Providers } from './providers';

import '@/styles/base.css';
import 'overlayscrollbars/overlayscrollbars.css';

export const viewport: Viewport = {
	themeColor: [
		{ media: '(prefers-color-scheme: light)', color: '#fbfbfb' },
		{ media: '(prefers-color-scheme: dark)', color: '#1a1a1e' },
	],
	colorScheme: 'light dark',
};

export const metadata: Metadata = {
	metadataBase: new URL(ENV.IS_LOCAL_DEV ? `http://localhost:${ENV.PORT}` : 'https://discord.js.org'),
	title: {
		template: '%s | discord.js',
		default: 'discord.js',
	},
	description: DESCRIPTION,
	icons: {
		other: [
			{
				url: '/favicon-96x96.png',
				sizes: '96x96',
				type: 'image/png',
			},
		],
		apple: ['/apple-touch-icon.png'],
	},

	manifest: '/site.webmanifest',

	openGraph: {
		siteName: 'discord.js',
		type: 'website',
		title: 'discord.js',
		description: DESCRIPTION,
	},

	twitter: {
		card: 'summary_large_image',
		creator: '@iCrawlToGo',
	},
};

export default async function RootLayout({ children }: PropsWithChildren) {
	return (
		<html className={`${GeistSans.variable} ${GeistMono.variable} antialiased`} lang="en" suppressHydrationWarning>
			<body className="text-base-md text-base-neutral-900 dark:text-base-neutral-40 overscroll-y-none bg-[#fbfbfb] dark:bg-[#1a1a1e]">
				<Providers>{children}</Providers>
				<Analytics />
			</body>
		</html>
	);
}
