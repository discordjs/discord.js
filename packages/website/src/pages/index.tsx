import { createStyles, Container, Title, Button, Group, Text, Center, Box, useMantineColorScheme } from '@mantine/core';
import Image from 'next/future/image';
import Link from 'next/link';
import { FiExternalLink } from 'react-icons/fi';
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, ghcolors } from 'react-syntax-highlighter/dist/cjs/styles/prism';

const useStyles = createStyles((theme) => ({
	outer: {
		display: 'flex',
		flexDirection: 'column',
		height: '100%',
		justifyContent: 'center',
		gap: 50,
		padding: 32,

		[theme.fn.smallerThan('md')]: {
			height: 'unset',
		},
	},

	inner: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',

		[theme.fn.smallerThan('md')]: {
			flexDirection: 'column',
			gap: 50,
		},
	},

	content: {
		maxWidth: 480,
		marginRight: theme.spacing.xl,

		[theme.fn.smallerThan('md')]: {
			marginRight: 0,
		},
	},

	title: {
		color: theme.colorScheme === 'dark' ? theme.white : theme.black,
		fontSize: 44,
		lineHeight: 1.2,
		fontWeight: 900,

		[theme.fn.smallerThan('xs')]: {
			fontSize: 28,
		},
	},

	highlight: {
		position: 'relative',
		backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
		borderRadius: theme.radius.sm,
		padding: '4px 12px',
	},
}));

export default function IndexRoute() {
	const { classes } = useStyles();
	const { colorScheme } = useMantineColorScheme();

	return (
		<Container className={classes.outer} size="lg">
			<Box className={classes.inner}>
				<Box className={classes.content}>
					<Title className={classes.title}>
						The <span className={classes.highlight}>most popular</span> way to build Discord <br /> bots.
					</Title>
					<Text color="dimmed" mt="md">
						discord.js is a powerful Node.js module that allows you to interact with the Discord API very easily. It
						takes a much more object-oriented approach than most other JS Discord libraries, making your bot&apos;s code
						significantly tidier and easier to comprehend.
					</Text>

					<Group mt={30}>
						<Link href="/docs" passHref prefetch={false}>
							<Button component="a" radius="sm" size="md">
								Docs
							</Button>
						</Link>
						<Link href="https://discordjs.guide" passHref prefetch={false}>
							<Button component="a" variant="default" radius="sm" size="md" rightIcon={<FiExternalLink />}>
								Guide
							</Button>
						</Link>
					</Group>
				</Box>
				<Box pb="xs">
					<SyntaxHighlighter
						wrapLongLines
						language="typescript"
						style={colorScheme === 'dark' ? vscDarkPlus : ghcolors}
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
				</Box>
			</Box>
			<Center>
				<Link href="https://vercel.com/?utm_source=discordjs&utm_campaign=oss" prefetch={false}>
					<a title="Vercel">
						<Image
							src="/powered-by-vercel.svg"
							alt="Vercel"
							width={0}
							height={0}
							style={{ height: '100%', width: '100%', maxWidth: 250 }}
						/>
					</a>
				</Link>
			</Center>
		</Container>
	);
}
