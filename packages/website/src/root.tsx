import type { MetaFunction, LinksFunction } from '@remix-run/node';
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';
import unocssReset from '@unocss/reset/normalize.css';
import maincss from './styles/main.css';
import unocss from './styles/unocss.css';

export const links: LinksFunction = () => [
	{ rel: 'stylesheet', href: unocssReset },
	{ rel: 'stylesheet', href: maincss },
	{ rel: 'stylesheet', href: unocss },
];

export const meta: MetaFunction = () => ({
	charset: 'utf-8',
	title: 'discord.js',
	viewport: 'width=device-width,initial-scale=1',
});

export default function App() {
	return (
		<html lang="en">
			<head>
				<Meta />
				<Links />
			</head>
			<body>
				<script
					dangerouslySetInnerHTML={{
						__html: `(() => {
							const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
							const persistedColorPreference = localStorage.getItem('theme') || 'auto';
							if (persistedColorPreference === 'dark' || (prefersDarkMode && persistedColorPreference !== 'light')) {
								document.documentElement.classList.toggle('dark', true);
							}
						})();`,
					}}
				/>
				<Outlet />
				<ScrollRestoration />
				<Scripts />
				<LiveReload />
			</body>
		</html>
	);
}
