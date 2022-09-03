import { Container, Title, Group, Button, Box, createStyles } from '@mantine/core';
import Head from 'next/head';
import Link from 'next/link';

const useStyles = createStyles((theme) => ({
	label: {
		textAlign: 'center',
		fontWeight: 900,
		fontSize: 220,
		lineHeight: 1,
		marginBottom: theme.spacing.xl * 1.5,
		color: theme.colorScheme === 'dark' ? theme.colors.dark![4] : theme.colors.gray![2],

		[theme.fn.smallerThan('sm')]: {
			fontSize: 120,
		},
	},
}));

export default function FourOhFourPage() {
	const { classes } = useStyles();

	return (
		<>
			<Head>
				<title key="title">discord.js | 404</title>
				<meta key="og_title" property="og:title" content="discord.js | 404" />
			</Head>
			<Container pt={96} pb={96}>
				<Box className={classes.label}>404</Box>
				<Title align="center">Not found.</Title>
				<Group position="center">
					<Link href="/docs/packages" passHref prefetch={false}>
						<Button component="a" variant="filled" size="md" mt="xl">
							Take me back
						</Button>
					</Link>
				</Group>
			</Container>
		</>
	);
}
