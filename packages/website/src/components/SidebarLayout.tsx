import type { getMembers, ApiItemJSON } from '@discordjs/api-extractor-utils';
import {
	useMantineTheme,
	AppShell,
	Navbar,
	MediaQuery,
	Header,
	Burger,
	Anchor,
	Breadcrumbs,
	ScrollArea,
	Group,
	Text,
	ThemeIcon,
	Box,
	UnstyledButton,
	createStyles,
	Menu,
	ActionIcon,
	Stack,
	Skeleton,
	LoadingOverlay,
	Container,
	Title,
} from '@mantine/core';
import { NextLink } from '@mantine/next';
import Image from 'next/future/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { useTheme } from 'next-themes';
import { type PropsWithChildren, useState, useEffect, useMemo } from 'react';
import { VscChevronDown, VscGithubInverted, VscPackage, VscVersions } from 'react-icons/vsc';
import { WiDaySunny, WiNightClear } from 'react-icons/wi';
import useSWR from 'swr';
import vercelLogo from '../assets/powered-by-vercel.svg';
import { SidebarItems } from './SidebarItems';
import type { findMember } from '~/util/model.server';
import { PACKAGES } from '~/util/packages';

const fetcher = async (url: string) => {
	const res = await fetch(url);
	return res.json();
};

export interface SidebarLayoutProps {
	branchName: string;
	data: {
		member: ReturnType<typeof findMember>;
		members: ReturnType<typeof getMembers>;
		searchIndex: any[];
		source: MDXRemoteSerializeResult;
	};
	packageName: string;

	selectedMember?: ApiItemJSON | undefined;
}

export type Members = SidebarLayoutProps['data']['members'];

export interface GroupedMembers {
	Classes: Members;
	Enums: Members;
	Functions: Members;
	Interfaces: Members;
	Types: Members;
	Variables: Members;
}

const useStyles = createStyles(
	(theme, { openedLib, openedVersion }: { openedLib: boolean; openedVersion: boolean }) => ({
		control: {
			display: 'block',
			width: '100%',
			padding: theme.spacing.xs,
			color: theme.colorScheme === 'dark' ? theme.colors.dark![0] : theme.black,
			backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark![6] : theme.colors.gray![1],
			borderRadius: theme.radius.xs,

			'&:hover': {
				backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark![5] : theme.colors.gray![2],
				color: theme.colorScheme === 'dark' ? theme.white : theme.black,
			},
		},

		iconLib: {
			transition: 'transform 150ms ease',
			transform: openedLib ? 'rotate(180deg)' : 'rotate(0deg)',
		},

		iconVersion: {
			transition: 'transform 150ms ease',
			transform: openedVersion ? 'rotate(180deg)' : 'rotate(0deg)',
		},

		content: {
			position: 'relative',
			minHeight: 'calc(100vh - 50px)',
			zIndex: 1,
			background: theme.colorScheme === 'dark' ? theme.colors.dark![8] : theme.colors.gray![0],
			boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
		},

		footer: {
			position: 'fixed',
			bottom: 0,
			left: 0,
			right: 0,
			height: 200,
			background: theme.colorScheme === 'dark' ? theme.colors.dark![7] : theme.colors.gray![0],
			paddingLeft: 324,

			[theme.fn.smallerThan('lg')]: {
				paddingRight: 54,
			},

			[theme.fn.smallerThan('md')]: {
				paddingLeft: 24,
			},

			[theme.fn.smallerThan('sm')]: {
				paddingRight: 24,
				height: 300,
			},
		},

		links: {
			display: 'flex',
			justifyContent: 'space-between',

			[theme.fn.smallerThan('sm')]: {
				flexDirection: 'column',
				alignItems: 'center',
				gap: 50,
			},
		},

		link: { color: theme.colorScheme === 'dark' ? theme.white : theme.black },
	}),
);

const packageMenuItems = PACKAGES.map((pkg) => (
	<Menu.Item
		key={pkg}
		component={NextLink}
		href={`/docs/packages/${pkg}/main`}
		sx={(theme) => ({ color: theme.colorScheme === 'dark' ? theme.white : theme.black })}
	>
		{pkg}
	</Menu.Item>
));

export function SidebarLayout({
	packageName,
	branchName,
	data,
	children,
}: PropsWithChildren<Partial<SidebarLayoutProps>>) {
	const router = useRouter();
	const [asPathWithoutQueryAndAnchor, setAsPathWithoutQueryAndAnchor] = useState('');
	const { data: versions } = useSWR<string[]>(
		`https://docs.discordjs.dev/api/info?package=${packageName ?? 'builders'}`,
		fetcher,
	);
	const mantineTheme = useMantineTheme();
	const { theme, setTheme } = useTheme();
	const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

	const [opened, setOpened] = useState(false);
	const [openedLibPicker, setOpenedLibPicker] = useState(false);
	const [openedVersionPicker, setOpenedVersionPicker] = useState(false);

	useEffect(() => {
		setOpened(false);
		setOpenedLibPicker(false);
		setOpenedVersionPicker(false);
	}, []);

	useEffect(() => {
		setAsPathWithoutQueryAndAnchor(router.asPath.split('?')[0]?.split('#')[0]?.split(':')[0] ?? '');
	}, [router.asPath]);

	const { classes } = useStyles({ openedLib: openedLibPicker, openedVersion: openedVersionPicker });

	const versionMenuItems = useMemo(
		() =>
			versions?.map((item) => (
				<Menu.Item
					key={item}
					component={NextLink}
					href={`/docs/packages/${packageName ?? 'builders'}/${item}`}
					sx={(theme) => ({ color: theme.colorScheme === 'dark' ? theme.white : theme.black })}
				>
					{item}
				</Menu.Item>
			)) ?? [],
		[versions, packageName],
	);

	const breadcrumbs = useMemo(
		() =>
			asPathWithoutQueryAndAnchor.split('/').map((path, idx, original) => (
				<Link key={idx} href={original.slice(0, idx + 1).join('/')} passHref prefetch={false}>
					<Anchor component="a" sx={(theme) => ({ color: theme.colorScheme === 'dark' ? theme.white : theme.black })}>
						{path}
					</Anchor>
				</Link>
			)),
		[asPathWithoutQueryAndAnchor],
	);

	return (
		<AppShell
			sx={(theme) => ({
				main: {
					background: theme.colorScheme === 'dark' ? theme.colors.dark![8] : theme.colors.gray![0],
					overflowX: 'auto',
				},
			})}
			padding={0}
			navbarOffsetBreakpoint="md"
			asideOffsetBreakpoint="md"
			navbar={
				<>
					<MediaQuery smallerThan="md" styles={{ display: 'none' }}>
						<LoadingOverlay
							sx={{ position: 'fixed', top: 70, width: 300 }}
							visible={router.isFallback}
							overlayBlur={2}
						/>
					</MediaQuery>
					<Navbar hiddenBreakpoint="md" hidden={!opened} width={{ md: 300 }}>
						{packageName && data ? (
							<>
								<Navbar.Section p="xs">
									<Stack spacing="xs">
										<Menu
											onOpen={() => setOpenedLibPicker(true)}
											onClose={() => setOpenedLibPicker(false)}
											radius="sm"
											width="target"
										>
											<Menu.Target>
												<UnstyledButton className={classes.control}>
													<Group position="apart">
														<Group>
															<ThemeIcon variant={theme === 'dark' ? 'filled' : 'outline'} radius="sm" size={30}>
																<VscPackage size={20} />
															</ThemeIcon>
															<Text weight="600" size="md">
																{packageName}
															</Text>
														</Group>
														<VscChevronDown className={classes.iconLib} size={20} />
													</Group>
												</UnstyledButton>
											</Menu.Target>
											<Menu.Dropdown>{packageMenuItems}</Menu.Dropdown>
										</Menu>

										<Menu
											onOpen={() => setOpenedVersionPicker(true)}
											onClose={() => setOpenedVersionPicker(false)}
											radius="sm"
											width="target"
										>
											<Menu.Target>
												<UnstyledButton className={classes.control}>
													<Group position="apart">
														<Group>
															<ThemeIcon variant={theme === 'dark' ? 'filled' : 'outline'} radius="sm" size={30}>
																<VscVersions size={20} />
															</ThemeIcon>
															<Text weight="600" size="md">
																{branchName}
															</Text>
														</Group>
														<VscChevronDown className={classes.iconVersion} size={20} />
													</Group>
												</UnstyledButton>
											</Menu.Target>
											<Menu.Dropdown>{versionMenuItems}</Menu.Dropdown>
										</Menu>
									</Stack>
								</Navbar.Section>

								<Navbar.Section px="xs" pb="xs" grow component={ScrollArea}>
									<SidebarItems members={data.members} setOpened={setOpened} />
								</Navbar.Section>
							</>
						) : null}
					</Navbar>
				</>
			}
			header={
				<Header
					sx={(theme) => ({
						boxShadow:
							theme.colorScheme === 'dark'
								? '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
								: 'unset',
					})}
					height={70}
					p="md"
				>
					<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
						<Box>
							<MediaQuery largerThan="md" styles={{ display: 'none' }}>
								<Burger
									opened={opened}
									onClick={() => (router.isFallback ? null : setOpened((isOpened) => !isOpened))}
									size="sm"
									color={mantineTheme.colors.gray![6]}
									mr="xl"
								/>
							</MediaQuery>

							<MediaQuery smallerThan="md" styles={{ display: 'none' }}>
								<Skeleton visible={router.isFallback} radius="sm">
									<Breadcrumbs>{breadcrumbs}</Breadcrumbs>
								</Skeleton>
							</MediaQuery>
						</Box>
						<Group>
							<Link href="https://github.com/discordjs/discord.js" passHref prefetch={false}>
								<ActionIcon
									component="a"
									target="_blank"
									rel="noopener noreferrer"
									variant="transparent"
									color="dark"
									title="GitHub repository"
								>
									<VscGithubInverted size={20} />
								</ActionIcon>
							</Link>
							<ActionIcon
								variant="subtle"
								color={theme === 'dark' ? 'yellow' : 'blue'}
								onClick={() => toggleTheme()}
								title="Toggle color scheme"
								radius="sm"
							>
								{theme === 'dark' ? <WiDaySunny size={30} /> : <WiNightClear size={30} />}
							</ActionIcon>
						</Group>
					</Box>
				</Header>
			}
		>
			<article>
				<Box className={classes.content} p="lg" pb={80}>
					{children}
				</Box>
				<Box sx={(theme) => ({ height: 200, [theme.fn.smallerThan('sm')]: { height: 300 } })} />
				<Box
					component="footer"
					sx={{ paddingRight: data?.member?.kind !== 'Class' && data?.member?.kind !== 'Interface' ? 54 : 324 }}
					className={classes.footer}
					pt={50}
				>
					<Container>
						<Box className={classes.links}>
							<a
								href="https://vercel.com/?utm_source=discordjs&utm_campaign=oss"
								target="_blank"
								rel="noopener noreferrer"
								title="Vercel"
							>
								<Image src={vercelLogo} alt="Vercel" />
							</a>
							<Group sx={(theme) => ({ gap: 50, [theme.fn.smallerThan('sm')]: { gap: 25 } })} align="flex-start">
								<Stack spacing={8}>
									<Title order={4}>Community</Title>
									<Stack spacing={0}>
										<Link href="https://discord.gg/djs" passHref prefetch={false}>
											<Anchor component="a" target="_blank" rel="noopener noreferrer" className={classes.link}>
												Discord
											</Anchor>
										</Link>
										<Link href="https://github.com/discordjs/discord.js/discussions" passHref prefetch={false}>
											<Anchor component="a" target="_blank" rel="noopener noreferrer" className={classes.link}>
												GitHub discussions
											</Anchor>
										</Link>
									</Stack>
								</Stack>
								<Stack spacing={8}>
									<Title order={4}>Project</Title>
									<Stack spacing={0}>
										<Link href="https://github.com/discordjs/discord.js" passHref prefetch={false}>
											<Anchor component="a" target="_blank" rel="noopener noreferrer" className={classes.link}>
												discord.js
											</Anchor>
										</Link>
										<Link href="https://discordjs.guide" passHref prefetch={false}>
											<Anchor component="a" target="_blank" rel="noopener noreferrer" className={classes.link}>
												discord.js guide
											</Anchor>
										</Link>
										<Link href="https://discord-api-types.dev" passHref prefetch={false}>
											<Anchor component="a" target="_blank" rel="noopener noreferrer" className={classes.link}>
												discord-api-types
											</Anchor>
										</Link>
									</Stack>
								</Stack>
							</Group>
						</Box>
					</Container>
				</Box>
			</article>
		</AppShell>
	);
}
