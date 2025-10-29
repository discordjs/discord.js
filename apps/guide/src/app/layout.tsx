import { Analytics } from '@vercel/analytics/react';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import type { Metadata, Viewport } from 'next';
import type { CSSProperties, PropsWithChildren } from 'react';
import { Body } from '@/app/layout.client';
import { source } from '@/lib/source';
import { ENV } from '@/util/env';
import { baseOptions } from './layout.config';

import '@/styles/base.css';

export const viewport: Viewport = {
	themeColor: [
		{ media: '(prefers-color-scheme: light)', color: '#fbfbfb' },
		{ media: '(prefers-color-scheme: dark)', color: '#1a1a1e' },
	],
	colorScheme: 'light dark',
};

export const metadata: Metadata = {
	metadataBase: new URL(ENV.IS_LOCAL_DEV ? `http://localhost:${ENV.PORT}` : 'https://discordjs.guide'),
	title: {
		template: '%s | discord.js',
		default: 'discord.js',
	},
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
		images: 'https://discordjs.dev/api/open-graph.png',
	},

	twitter: {
		card: 'summary_large_image',
		creator: '@iCrawlToGo',
	},
};

export default async function RootLayout({ children }: PropsWithChildren) {
	return (
		<html className={`${GeistSans.variable} ${GeistMono.variable} antialiased`} lang="en" suppressHydrationWarning>
			<Body>
				<RootProvider>
					<DocsLayout
						sidebar={{
							tabs: {
								transform(option, node) {
									const meta = source.getNodeMeta(node);
									if (!meta || !node.icon) return option;

									// category selection color based on path src/styles/base.css
									const color = `var(--${meta.path.split('/')[0]}-color, var(--color-fd-foreground))`;

									return {
										...option,
										icon: (
											<div
												className="size-full rounded-lg text-(--tab-color) max-md:border max-md:bg-(--tab-color)/10 max-md:p-1.5 [&_svg]:size-full"
												style={
													{
														'--tab-color': color,
													} as CSSProperties
												}
											>
												{node.icon}
											</div>
										),
									};
								},
							},
						}}
						tree={source.pageTree}
						{...baseOptions}
					>
						{children}
					</DocsLayout>
				</RootProvider>
				<Analytics />
			</Body>
		</html>
	);
}
