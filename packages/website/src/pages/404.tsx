import Head from 'next/head';
import Link from 'next/link';
import { styled } from '../../stitches.config';
import { AnchorButton } from '~/components/AnchorButton';
import { Container } from '~/components/Container';

const Heading = styled('h1', {
	fontSize: 140,
	fontWeight: 900,
	margin: 0,

	'@sm': {
		fontSize: 200,
	},
});

const SubHeading = styled('h2', {
	fontSize: 30,
	margin: 0,

	'@sm': {
		fontSize: 40,
	},
});

export default function FourOhFourPage() {
	return (
		<>
			<Head>
				<title key="title">discord.js | 404</title>
				<meta key="og_title" property="og:title" content="discord.js | 404" />
			</Head>
			<Container xs css={{ gap: 30 }}>
				<Heading>404</Heading>
				<SubHeading>Not found.</SubHeading>
				<Link href="/docs/packages" passHref prefetch={false}>
					<AnchorButton>Take me back</AnchorButton>
				</Link>
			</Container>
		</>
	);
}
