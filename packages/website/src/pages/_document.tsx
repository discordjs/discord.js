import { createStylesServer, ServerStyles } from '@mantine/next';
import Document, { Html, Head, Main, NextScript, DocumentContext, DocumentInitialProps } from 'next/document';

const stylesServer = createStylesServer();

export default class _Document extends Document {
	public static override async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
		const initialProps = await Document.getInitialProps(ctx);

		return {
			...initialProps,
			styles: [initialProps.styles, <ServerStyles html={initialProps.html} server={stylesServer} key="styles" />],
		};
	}

	public override render() {
		return (
			<Html>
				<Head>
					<meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
					<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
					<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
					<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
					<link rel="manifest" href="/site.webmanifest" />
					<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#090a16" />
					<meta name="apple-mobile-web-app-title" content="discord.js" />
					<meta name="application-name" content="discord.js" />
					<meta name="msapplication-TileColor" content="#090a16" />
					<meta name="theme-color" content="#1a1b1e" />
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}
