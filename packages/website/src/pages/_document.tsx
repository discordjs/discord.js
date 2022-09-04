import { createGetInitialProps } from '@mantine/next';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import { DESCRIPTION } from '~/util/constants';

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

					<meta name="color-scheme" content="dark light" />
					<meta name="apple-mobile-web-app-title" content="discord.js" />
					<meta name="application-name" content="discord.js" />
					<meta name="msapplication-TileColor" content="#090a16" />
					<meta key="description" name="description" content={DESCRIPTION} />
					<meta property="og:site_name" content="discord.js" />
					<meta key="og_title" property="og:title" content="discord.js" />
					<meta key="og_description" name="og:description" content={DESCRIPTION} />
					<meta property="og:image" content="https://discordjs.dev/open-graph.png" />
					<meta name="twitter:card" content="summary_large_image" />
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}
