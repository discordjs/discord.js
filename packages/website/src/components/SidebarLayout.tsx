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
	useMantineColorScheme,
	Stack,
	Skeleton,
	LoadingOverlay,
	Container,
	Title,
} from '@mantine/core';
import { NextLink } from '@mantine/next';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';
import Image from 'next/future/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { type PropsWithChildren, useState, useEffect } from 'react';
import { VscChevronDown, VscGithubInverted, VscPackage, VscVersions } from 'react-icons/vsc';
import { WiDaySunny, WiNightClear } from 'react-icons/wi';
import useSWR from 'swr';
import { SidebarItems } from './SidebarItems';
import type { ApiItemJSON } from '~/DocModel/ApiNodeJSONEncoder';
import type { findMember } from '~/util/model.server';
import { PACKAGES } from '~/util/packages';
import type { getMembers } from '~/util/parse.server';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export interface SidebarLayoutProps {
	packageName: string;
	branchName: string;
	data: {
		members: ReturnType<typeof getMembers>;
		member: ReturnType<typeof findMember>;
		source: MDXRemoteSerializeResult;
	};

	selectedMember?: ApiItemJSON | undefined;
}

export type Members = SidebarLayoutProps['data']['members'];

export interface GroupedMembers {
	Classes: Members;
	Functions: Members;
	Enums: Members;
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
				paddingRight: 24,
			},

			[theme.fn.smallerThan('md')]: {
				paddingLeft: 24,
			},

			[theme.fn.smallerThan('sm')]: {
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
	}),
);

const packageMenuItems = PACKAGES.map((pkg) => (
	<Menu.Item key={pkg} component={NextLink} href={`/docs/packages/${pkg}/main`}>
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
	const theme = useMantineTheme();
	const { colorScheme, toggleColorScheme } = useMantineColorScheme();

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

	const versionMenuItems =
		versions?.map((item) => (
			<Menu.Item key={item} component={NextLink} href={`/docs/packages/${packageName ?? 'builders'}/${item}`}>
				{item}
			</Menu.Item>
		)) ?? [];

	const breadcrumbs = asPathWithoutQueryAndAnchor.split('/').map((path, idx, original) => (
		<Link key={idx} href={original.slice(0, idx + 1).join('/')} passHref>
			<Anchor component="a">{path}</Anchor>
		</Link>
	));

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
															<ThemeIcon variant={colorScheme === 'dark' ? 'filled' : 'outline'} radius="sm" size={30}>
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
															<ThemeIcon variant={colorScheme === 'dark' ? 'filled' : 'outline'} radius="sm" size={30}>
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
									onClick={() => (router.isFallback ? null : setOpened((o) => !o))}
									size="sm"
									color={theme.colors.gray![6]}
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
							<Link href="https://github.com/discordjs/discord.js" passHref>
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
								color={colorScheme === 'dark' ? 'yellow' : 'blue'}
								onClick={() => toggleColorScheme()}
								title="Toggle color scheme"
								radius="sm"
							>
								{colorScheme === 'dark' ? <WiDaySunny size={30} /> : <WiNightClear size={30} />}
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
				<Box sx={(theme) => ({ height: 200, [theme.fn.smallerThan('sm')]: { height: 300 } })}></Box>
				<Box
					component="footer"
					sx={{ paddingRight: data?.member?.kind !== 'Class' && data?.member?.kind !== 'Interface' ? 24 : 324 }}
					className={classes.footer}
					pt={50}
				>
					<Container>
						<Box className={classes.links}>
							<Link href="https://vercel.com/?utm_source=discordjs&utm_campaign=oss" passHref>
								<a title="Vercel">
									<Image
										src="/powered-by-vercel.svg"
										alt="Vercel"
										width={0}
										height={0}
										style={{ height: '100%', width: '100%', maxWidth: 200 }}
									/>
								</a>
							</Link>
							<Group sx={(theme) => ({ gap: 50, [theme.fn.smallerThan('sm')]: { gap: 25 } })} align="flex-start">
								<Stack spacing={8}>
									<Title order={4}>Community</Title>
									<Stack spacing={0}>
										<Link href="https://discord.gg/djs" passHref>
											<Anchor component="a" target="_blank" rel="noopener noreferrer">
												Discord
											</Anchor>
										</Link>
										<Link href="https://github.com/discordjs/discord.js/discussions" passHref>
											<Anchor component="a" target="_blank" rel="noopener noreferrer">
												GitHub discussions
											</Anchor>
										</Link>
									</Stack>
								</Stack>
								<Stack spacing={8}>
									<Title order={4}>Project</Title>
									<Stack spacing={0}>
										<Link href="https://github.com/discordjs/discord.js" passHref>
											<Anchor component="a" target="_blank" rel="noopener noreferrer">
												discord.js
											</Anchor>
										</Link>
										<Link href="https://discordjs.guide" passHref>
											<Anchor component="a" target="_blank" rel="noopener noreferrer">
												discord.js guide
											</Anchor>
										</Link>
										<Link href="https://discord-api-types.dev" passHref>
											<Anchor component="a" target="_blank" rel="noopener noreferrer">
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
