import { ColorScheme, ColorSchemeProvider, MantineProvider } from '@mantine/core';
import { useColorScheme } from '@mantine/hooks';
import { type SpotlightAction, SpotlightProvider } from '@mantine/spotlight';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { type NextRouter, useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { VscPackage } from 'react-icons/vsc';
import { RouterTransition } from '~/components/RouterTransition';
import '../styles/unocss.css';
import '../styles/main.css';

const actions: (router: NextRouter) => SpotlightAction[] = (router: NextRouter) => [
	{
		title: 'Home',
		description: 'Go to landing page',
		onTrigger: () => void router.push('/'),
		icon: <VscPackage size={20} />,
	},
	{
		title: 'Packages',
		description: 'Go to the package selection',
		onTrigger: () => void router.push('/docs/packages'),
		icon: <VscPackage size={20} />,
	},
	{
		id: 'packages-builders',
		title: 'Builders',
		description: 'Go to the @discordjs/builders documentation',
		onTrigger: () => void router.push('/docs/packages/builders'),
		icon: <VscPackage size={20} />,
	},
	{
		id: 'packages-collection',
		title: 'Collection',
		description: 'Go to the @discordjs/collection documentation',
		onTrigger: () => void router.push('/docs/packages/collection'),
		icon: <VscPackage size={20} />,
	},
	{
		id: 'packages-proxy',
		title: 'Proxy',
		description: 'Go to the @discordjs/proxy documentation',
		onTrigger: () => void router.push('/docs/packages/proxy'),
		icon: <VscPackage size={20} />,
	},
	{
		id: 'packages-rest',
		title: 'REST',
		description: 'Go to the @discordjs/rest documentation',
		onTrigger: () => void router.push('/docs/packages/voice'),
		icon: <VscPackage size={20} />,
	},
	{
		id: 'packages-voice',
		title: 'Voice',
		description: 'Go to the @discordjs/voice documentation',
		onTrigger: () => void router.push('/docs/packages/ws'),
		icon: <VscPackage size={20} />,
	},
	{
		id: 'packages-ws',
		title: 'WS',
		description: 'Go to the @discordjs/ws documentation',
		onTrigger: () => void router.push('/docs'),
		icon: <VscPackage size={20} />,
	},
];

export default function MyApp({ Component, pageProps }: AppProps) {
	const router = useRouter();
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
				<title key="title">discord.js</title>
				<meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
			</Head>
			<ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
				<MantineProvider
					theme={{
						fontFamily: 'Inter var',
						fontFamilyMonospace: 'JetBrains Mono',
						headings: {
							fontFamily: 'Inter var',
						},
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
					<SpotlightProvider shortcut={['mod + P', 'mod + K', '/']} actions={actions(router)}>
						<RouterTransition />
						<Component {...pageProps} />
					</SpotlightProvider>
				</MantineProvider>
			</ColorSchemeProvider>
		</>
	);
}
