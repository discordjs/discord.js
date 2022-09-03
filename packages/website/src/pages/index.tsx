import Image from 'next/future/image';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { FiExternalLink } from 'react-icons/fi';
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, ghcolors } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { styled } from '../../stitches.config';
import vercelLogo from '../assets/powered-by-vercel.svg';
import { AnchorButton } from '~/components/AnchorButton';
import { Container } from '~/components/Container';
import { SplitContainer } from '~/components/SplitContainer';

const ContentContainer = styled('div', {
	maxWidth: 480,

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

const Highlight = styled('span', {
	position: 'relative',
	backgroundColor: '$blue9',
	borderRadius: 4,
	padding: '4px 12px',
});

const Text = styled('p', {
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
	const { resolvedTheme } = useTheme();

	return (
		<Container>
			<SplitContainer vertical css={{ '@md': { flexDirection: 'row' } }}>
				<ContentContainer>
					<Heading>
						The <Highlight>most popular</Highlight> way to build Discord <br /> bots.
					</Heading>
					<Text>
						discord.js is a powerful node.js module that allows you to interact with the Discord API very easily. It
						takes a much more object-oriented approach than most other JS Discord libraries, making your bot&apos;s code
						significantly tidier and easier to comprehend.
					</Text>
					<Group>
						<Link href="/docs" passHref prefetch={false}>
							<AnchorButton>Docs</AnchorButton>
						</Link>
						<AnchorButton color="secondary" href="https://discordjs.guide" target="_blank" rel="noopener noreferrer">
							Guide <FiExternalLink />
						</AnchorButton>
					</Group>
				</ContentContainer>
				<div>
					<SyntaxHighlighter
						wrapLongLines
						language="typescript"
						style={resolvedTheme === 'dark' ? vscDarkPlus : ghcolors}
						codeTagProps={{ style: { fontFamily: 'JetBrains Mono' } }}
					>
						{`import { Client, GatewayIntentBits } from 'discord.js';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on('ready', () => {
	console.log(\`Logged in as \${client.user.tag}!\`);
});

client.on('interactionCreate', async (interaction) => {
	if (!interaction.isChatInputCommand()) return;

	if (interaction.commandName === 'ping') {
		await interaction.reply('Pong!');
	}
});

await client.login('token');`}
					</SyntaxHighlighter>
				</div>
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
