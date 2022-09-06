import { MantineProvider } from '@mantine/core';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import NextProgress from 'next-progress';
import { ThemeProvider, useTheme } from 'next-themes';
import '@unocss/reset/antfu.css';
import '../styles/unocss.css';
import '../styles/main.css';

export default function MyApp({ Component, pageProps }: AppProps) {
	const { resolvedTheme } = useTheme();

	return (
		<>
			<Head>
				<title key="title">discord.js</title>
				<meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
				<meta name="theme-color" content={resolvedTheme === 'dark' ? '#161616' : '#ffffff'} />
			</Head>
			<ThemeProvider
				attribute="class"
				defaultTheme="system"
				value={{
					light: 'light',
					dark: 'dark',
				}}
				disableTransitionOnChange
			>
				<MantineProvider
					theme={{
						fontFamily: 'Inter',
						fontFamilyMonospace: 'JetBrains Mono',
						headings: {
							fontFamily: 'Inter',
						},
						colors: {
							blurple: [
								'#5865f2',
								'#5865f2',
								'#5865f2',
								'#5865f2',
								'#5865f2',
								'#5865f2',
								'#5865f2',
								'#5865f2',
								'#5865f2',
								'#5865f2',
							],
						},
						primaryColor: 'blurple',
					}}
					withCSSVariables
				>
					<NextProgress color="#5865f2" options={{ showSpinner: false }} />
					<Component {...pageProps} />
				</MantineProvider>
			</ThemeProvider>
		</>
	);
}
