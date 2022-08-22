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
	Center,
	Stack,
} from '@mantine/core';
import { NextLink } from '@mantine/next';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';
import Image from 'next/future/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { type PropsWithChildren, useState } from 'react';
import { VscChevronDown, VscPackage, VscVersions } from 'react-icons/vsc';
import { WiDaySunny, WiNightClear } from 'react-icons/wi';
import useSWR from 'swr';
import { SidebarItems } from './SidebarItems';
import type { ApiItemJSON } from '~/DocModel/ApiNodeJSONEncoder';
import type { findMember } from '~/util/model.server';
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
	}),
);

const libraries = [
	{ label: 'builders', value: 'builders' },
	{ label: 'collection', value: 'collection' },
	{ label: 'discord.js', value: 'discord.js' },
	{ label: 'proxy', value: 'proxy' },
	{ label: 'rest', value: 'rest' },
	{ label: 'voice', value: 'voice' },
	{ label: 'ws', value: 'ws' },
];

export function SidebarLayout({
	packageName,
	branchName,
	data,
	children,
}: PropsWithChildren<Partial<SidebarLayoutProps>>) {
	const router = useRouter();
	const { data: versions } = useSWR<string[]>(
		`https://docs.discordjs.dev/api/info?package=${packageName ?? 'builders'}`,
		fetcher,
	);
	const theme = useMantineTheme();
	const { colorScheme, toggleColorScheme } = useMantineColorScheme();
	const dark = colorScheme === 'dark';

	const [opened, setOpened] = useState(false);
	const [openedLibPicker, setOpenedLibPicker] = useState(false);
	const [openedVersionPicker, setOpenedVersionPicker] = useState(false);

	const { classes } = useStyles({ openedLib: openedLibPicker, openedVersion: openedVersionPicker });

	const libraryMenuItems = libraries.map((item) => (
		<Menu.Item key={item.label} component={NextLink} href={`/docs/packages/${item.value}/main`}>
			{item.label}
		</Menu.Item>
	));

	const versionMenuItems =
		versions?.map((item) => (
			<Menu.Item key={item} component={NextLink} href={`/docs/packages/${packageName ?? 'builders'}/${item}`}>
				{item}
			</Menu.Item>
		)) ?? [];

	const asPathWithoutQuery = router.asPath.split('?')[0]?.split('#')[0];
	const breadcrumbs = asPathWithoutQuery?.split('/').map((path, idx, original) => (
		<Link key={idx} href={original.slice(0, idx + 1).join('/')} passHref>
			<Anchor component="a">{path}</Anchor>
		</Link>
	));

	return (
		<AppShell
			sx={{
				main: {
					background: theme.colorScheme === 'dark' ? theme.colors.dark![8] : theme.colors.gray![0],
					overflowX: 'auto',
				},
			}}
			padding={0}
			navbarOffsetBreakpoint="md"
			asideOffsetBreakpoint="md"
			navbar={
				<Navbar hiddenBreakpoint="md" hidden={!opened} width={{ md: 300 }}>
					{packageName && data ? (
						<>
							<Navbar.Section p="xs">
								<Stack spacing="xs">
									<Menu
										onOpen={() => setOpenedLibPicker(true)}
										onClose={() => setOpenedLibPicker(false)}
										radius="xs"
										width="target"
									>
										<Menu.Target>
											<UnstyledButton className={classes.control}>
												<Group position="apart">
													<Group>
														<ThemeIcon variant={colorScheme === 'dark' ? 'filled' : 'outline'} size={30}>
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
										<Menu.Dropdown>{libraryMenuItems}</Menu.Dropdown>
									</Menu>

									<Menu
										onOpen={() => setOpenedVersionPicker(true)}
										onClose={() => setOpenedVersionPicker(false)}
										radius="xs"
										width="target"
									>
										<Menu.Target>
											<UnstyledButton className={classes.control}>
												<Group position="apart">
													<Group>
														<ThemeIcon variant={colorScheme === 'dark' ? 'filled' : 'outline'} size={30}>
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
			}
			header={
				<Header height={70} p="md">
					<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
						<Box>
							<MediaQuery largerThan="md" styles={{ display: 'none' }}>
								<Burger
									opened={opened}
									onClick={() => setOpened((o) => !o)}
									size="sm"
									color={theme.colors.gray![6]}
									mr="xl"
								/>
							</MediaQuery>

							<MediaQuery smallerThan="md" styles={{ display: 'none' }}>
								<Breadcrumbs>{breadcrumbs}</Breadcrumbs>
							</MediaQuery>
						</Box>
						<ActionIcon
							variant="outline"
							color={dark ? 'yellow' : 'blurple'}
							onClick={() => toggleColorScheme()}
							title="Toggle color scheme"
						>
							{dark ? <WiDaySunny size={20} /> : <WiNightClear size={20} />}
						</ActionIcon>
					</Box>
				</Header>
			}
		>
			<article>
				<Box
					sx={{
						position: 'relative',
						minHeight: 'calc(100vh - 50px)',
						zIndex: 1,
						background: theme.colorScheme === 'dark' ? theme.colors.dark![8] : theme.colors.gray![0],
					}}
					p="lg"
					pb={80}
				>
					{children}
				</Box>
				<Box sx={{ height: 200 }}></Box>
				<Box
					sx={{
						position: 'fixed',
						bottom: 0,
						left: 0,
						right: 0,
						height: 200,
						background: theme.colorScheme === 'dark' ? theme.colors.dark![7] : theme.colors.gray![0],
						paddingLeft: 324,
						paddingRight: 324,

						[theme.fn.smallerThan('lg')]: {
							paddingRight: 24,
						},

						[theme.fn.smallerThan('md')]: {
							paddingLeft: 24,
						},
					}}
					pt={70}
				>
					<Center>
						<Link href="https://vercel.com/?utm_source=discordjs&utm_campaign=oss" passHref>
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
				</Box>
			</article>
		</AppShell>
	);
}
