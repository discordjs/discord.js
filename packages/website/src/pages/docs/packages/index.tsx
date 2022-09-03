import { Container, UnstyledButton, createStyles, Group, ThemeIcon, Text, Stack, Title, Button } from '@mantine/core';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTheme } from 'next-themes';
import type { MouseEvent } from 'react';
import { VscArrowRight, VscPackage } from 'react-icons/vsc';
import { PACKAGES } from '~/util/packages';

const useStyles = createStyles((theme) => ({
	outer: {
		display: 'flex',
		height: '100%',
		alignItems: 'center',
	},

	control: {
		padding: theme.spacing.xs,
		color: theme.colorScheme === 'dark' ? theme.colors.dark![0] : theme.black,
		borderRadius: theme.radius.xs,

		'&:hover': {
			backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark![6] : theme.colors.gray![0],
			color: theme.colorScheme === 'dark' ? theme.white : theme.black,
		},
	},
}));

export default function PackagesRoute() {
	const { classes } = useStyles();
	const { theme } = useTheme();
	const router = useRouter();

	const handleClick = async (ev: MouseEvent<HTMLDivElement>, packageName: string) => {
		ev.stopPropagation();

		const res = await fetch(`https://docs.discordjs.dev/api/info?package=${packageName ?? 'builders'}`);
		const data: string[] = await res.json();

		const latestVersion = data.at(-2);
		void router.push(`/docs/packages/${packageName}/${latestVersion}`);
	};

	return (
		<Container className={classes.outer} size="xs">
			<Stack sx={{ flexGrow: 1 }}>
				<Title order={2} ml="xs">
					Select a package:
				</Title>
				{PACKAGES.map((pkg) => (
					<UnstyledButton
						component="div"
						key={pkg}
						role="link"
						className={classes.control}
						onClick={(ev: MouseEvent<HTMLDivElement>) => void handleClick(ev, pkg)}
					>
						<Group position="apart">
							<Group sx={{ flexGrow: 1 }} position="apart">
								<Group>
									<ThemeIcon variant={theme === 'dark' ? 'filled' : 'outline'} radius="sm" size={30}>
										<VscPackage size={20} />
									</ThemeIcon>
									<Text weight={600} size="md">
										{pkg}
									</Text>
								</Group>
								<Link href={`/docs/packages/${pkg}`} passHref prefetch={false}>
									<Button
										component="a"
										size="xs"
										compact
										onClick={(ev: MouseEvent<HTMLAnchorElement>) => ev.stopPropagation()}
									>
										Select version
									</Button>
								</Link>
							</Group>
							<VscArrowRight size={20} />
						</Group>
					</UnstyledButton>
				))}
			</Stack>
		</Container>
	);
}
