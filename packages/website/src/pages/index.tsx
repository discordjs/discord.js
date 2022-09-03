import Image from 'next/future/image';
import Link from 'next/link';
import { FiExternalLink } from 'react-icons/fi';
import { styled } from '../../stitches.config';
import vercelLogo from '../assets/powered-by-vercel.svg';
import { AnchorButton } from '~/components/AnchorButton';
import { Container } from '~/components/Container';
import { SplitContainer } from '~/components/SplitContainer';
import { SyntaxHighlighter } from '~/components/SyntaxHighlighter';
import { TextHighlight } from '~/components/TextHighlight';
import { CODE_EXAMPLE } from '~/util/constants';

const ContentContainer = styled('div', {
	maxWidth: 480,
	display: 'flex',
	flexDirection: 'column',
	gap: 10,

	'@md': {
		marginRight: 32,
	},
});

const Heading = styled('h1', {
	fontSize: 28,
	lineHeight: 1.2,
	fontWeight: 900,
	margin: 0,

	'@xs': {
		fontSize: 44,
	},
});

const PromotionalText = styled('p', {
	color: '$gray11',
	lineHeight: 1.55,
	marginBottom: 26,
});

const Group = styled('div', {
	display: 'flex',
	gap: 15,
});

const Center = styled('div', {
	display: 'flex',
	placeContent: 'center',
});

export default function IndexRoute() {
	return (
		<Container>
			<SplitContainer vertical css={{ gap: 50, '@md': { flexDirection: 'row', gap: 20 } }}>
				<ContentContainer>
					<Heading>
						The <TextHighlight>most popular</TextHighlight> way to build Discord <br /> bots.
					</Heading>
					<PromotionalText>
						discord.js is a powerful node.js module that allows you to interact with the Discord API very easily. It
						takes a much more object-oriented approach than most other JS Discord libraries, making your bot&apos;s code
						significantly tidier and easier to comprehend.
					</PromotionalText>
					<Group>
						<Link href="/docs" passHref prefetch={false}>
							<AnchorButton>Docs</AnchorButton>
						</Link>
						<AnchorButton color="secondary" href="https://discordjs.guide" target="_blank" rel="noopener noreferrer">
							Guide <FiExternalLink />
						</AnchorButton>
					</Group>
				</ContentContainer>
				<SyntaxHighlighter code={CODE_EXAMPLE} />
			</SplitContainer>
			<Center>
				<a
					href="https://vercel.com/?utm_source=discordjs&utm_campaign=oss"
					target="_blank"
					rel="noopener noreferrer"
					title="Vercel"
				>
					<Image src={vercelLogo} alt="Vercel" />
				</a>
			</Center>
		</Container>
	);
}
