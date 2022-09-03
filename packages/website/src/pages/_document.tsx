import { createGetInitialProps } from '@mantine/next';
import Document, { Html, Head, Main, NextScript } from 'next/document';

const getInitialProps = createGetInitialProps();

export default class _Document extends Document {
	public static override getInitialProps = getInitialProps;

	public override render() {
		return (
			<Html lang="en">
				<Head>
					<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
					<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
					<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
					<link rel="manifest" href="/site.webmanifest" />
					<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#090a16" />

					<meta name="apple-mobile-web-app-title" content="discord.js" />
					<meta name="application-name" content="discord.js" />
					<meta name="msapplication-TileColor" content="#090a16" />
					<meta name="theme-color" content="#1a1b1e" />
					<meta
						name="description"
						content="discord.js is a powerful Node.js module that allows you to interact with the Discord API very easily. It takes a much more object-oriented approach than most other JS Discord libraries, making your bot's code significantly tidier and easier to comprehend."
					/>
					<meta property="og:title" content="discord.js" />
					<meta property="og:image" content="https://discordjs.dev/open-graph.png" />
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}
