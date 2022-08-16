import { ColorScheme, ColorSchemeProvider, MantineProvider } from '@mantine/core';
import { useColorScheme } from '@mantine/hooks';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { RouterTransition } from '~/components/RouterTransition';
import '../styles/unocss.css';
import '../styles/main.css';

export default function MyApp({ Component, pageProps }: AppProps) {
	const preferredColorScheme = useColorScheme('dark', { getInitialValueInEffect: true });
	const [colorScheme, setColorScheme] = useState<ColorScheme>(preferredColorScheme);
	const toggleColorScheme = (value?: ColorScheme) =>
		setColorScheme(value ?? (colorScheme === 'dark' ? 'light' : 'dark'));

	useEffect(() => {
		setColorScheme(preferredColorScheme);
	}, [preferredColorScheme]);

	return (
		<>
			<Head>
				<meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
			</Head>

			<ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
				<MantineProvider
					theme={{
						fontFamily: 'Inter',
						colorScheme,
						colors: {
							blurple: [
								'#5865F2',
								'#5865F2',
								'#5865F2',
								'#5865F2',
								'#5865F2',
								'#5865F2',
								'#5865F2',
								'#5865F2',
								'#5865F2',
								'#5865F2',
							],
						},
						primaryColor: 'blurple',
					}}
					withCSSVariables
					withNormalizeCSS
					withGlobalStyles
				>
					<RouterTransition />
					<Component {...pageProps} />
				</MantineProvider>
			</ColorSchemeProvider>
		</>
	);
}
