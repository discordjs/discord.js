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
				<Head />
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}
