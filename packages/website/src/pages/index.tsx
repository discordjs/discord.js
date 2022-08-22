import { createStyles, Container, Title, Button, Group, Text, Center } from '@mantine/core';
import Image from 'next/future/image';
import Link from 'next/link';
import codeSample from '../assets/code-sample.png';

const useStyles = createStyles((theme) => ({
	inner: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingTop: theme.spacing.xl * 4,
		paddingBottom: theme.spacing.xl * 4,

		[theme.fn.smallerThan('md')]: {
			flexDirection: 'column',
			gap: 50,
		},
	},

	content: {
		maxWidth: 480,
		marginRight: theme.spacing.xl * 3,

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

	control: {
		[theme.fn.smallerThan('xs')]: {
			flex: 1,
		},
	},

	image: {
		flex: 1,
		height: '100%',
		maxWidth: 550,

		[theme.fn.smallerThan('xs')]: {
			maxWidth: 350,
		},
	},

	vercel: {
		paddingBottom: theme.spacing.xl * 4,
	},
}));

export default function IndexRoute() {
	const { classes } = useStyles();
	return (
		<div>
			<Container size="lg">
				<div className={classes.inner}>
					<div className={classes.content}>
						<Title className={classes.title}>
							The <span className={classes.highlight}>most popular</span> way to build Discord <br /> bots.
						</Title>
						<Text color="dimmed" mt="md">
							discord.js is a powerful Node.js module that allows you to interact with the Discord API very easily. It
							takes a much more object-oriented approach than most other JS Discord libraries, making your bot&apos;s
							code significantly tidier and easier to comprehend.
						</Text>

						<Group mt={30}>
							<Link href="/docs" passHref>
								<Button component="a" radius="xl" size="md" className={classes.control}>
									Docs
								</Button>
							</Link>
							<Link href="https://discordjs.guide" passHref>
								<Button component="a" variant="default" radius="xl" size="md" className={classes.control}>
									Guide
								</Button>
							</Link>
						</Group>
					</div>
					<Image src={codeSample} className={classes.image} />
				</div>
				<Center>
					<Link href="https://vercel.com/?utm_source=discordjs&utm_campaign=oss" passHref>
						<a title="Vercel">
							<Image
								src="/powered-by-vercel.svg"
								alt="Vercel"
								width={0}
								height={0}
								style={{ height: '100%', width: '100%', maxWidth: 250 }}
								className={classes.vercel}
							/>
						</a>
					</Link>
				</Center>
			</Container>
		</div>
	);
}
