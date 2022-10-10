import { Html, Head, Main, NextScript } from 'next/document';
import { DESCRIPTION } from '~/util/constants';

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				<link href="/apple-touch-icon.png" rel="apple-touch-icon" sizes="180x180" />
				<link href="/favicon-32x32.png" rel="icon" sizes="32x32" type="image/png" />
				<link href="/favicon-16x16.png" rel="icon" sizes="16x16" type="image/png" />
				<link href="/site.webmanifest" rel="manifest" />
				<link color="#090a16" href="/safari-pinned-tab.svg" rel="mask-icon" />
				<meta content="light dark" name="color-scheme" />
				<meta content="discord.js" name="apple-mobile-web-app-title" />
				<meta content="discord.js" name="application-name" />
				<meta content="#090a16" name="msapplication-TileColor" />
				<meta content={DESCRIPTION} key="description" name="description" />
				<meta content="discord.js" property="og:site_name" />
				<meta content="website" property="og:type" />
				<meta content="discord.js" key="og_title" property="og:title" />
				<meta content={DESCRIPTION} key="og_description" name="og:description" />
				<meta content="https://discordjs.dev/open-graph.png" property="og:image" />
				<meta content="summary_large_image" name="twitter:card" />
				<meta content="@iCrawlToGo" name="twitter:creator" />
			</Head>
			<body className="dark:bg-dark-800 bg-white">
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
