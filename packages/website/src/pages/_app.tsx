import type { AppProps } from 'next/app';
import Head from 'next/head';
import NextProgress from 'next-progress';
import { ThemeProvider } from 'next-themes';
import '@unocss/reset/antfu.css';
import '../styles/unocss.css';
import '../styles/main.css';

export default function MyApp({ Component, pageProps }: AppProps) {
	return (
		<>
			<Head>
				<title key="title">discord.js</title>
				<meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
				<meta name="theme-color" content="#5865f2" />
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
				<NextProgress color="#5865f2" options={{ showSpinner: false }} />
				<Component {...pageProps} />
			</ThemeProvider>
		</>
	);
}
