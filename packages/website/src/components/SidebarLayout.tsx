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
} from '@mantine/core';
import { NextLink } from '@mantine/next';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';
import Image from 'next/future/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { type PropsWithChildren, useState } from 'react';
import { VscChevronDown, VscPackage } from 'react-icons/vsc';
import { WiDaySunny, WiNightClear } from 'react-icons/wi';
import { SidebarItems } from './SidebarItems';
import type { ApiItemJSON } from '~/DocModel/ApiNodeJSONEncoder';
import type { findMember } from '~/util/model.server';
import type { getMembers } from '~/util/parse.server';

export interface SidebarLayoutProps {
	packageName: string;
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

const useStyles = createStyles((theme, { opened }: { opened: boolean }) => ({
	control: {
		display: 'block',
		width: '100%',
		padding: theme.spacing.xs,
		color: theme.colorScheme === 'dark' ? theme.colors.dark![0] : theme.black,

		'&:hover': {
			backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark![6] : theme.colors.gray![0],
			color: theme.colorScheme === 'dark' ? theme.white : theme.black,
		},
	},

	icon: {
		transition: 'transform 150ms ease',
		transform: opened ? 'rotate(180deg)' : 'rotate(0deg)',
	},
}));

const libraries = [
	{ label: 'builders', value: 'builders' },
	{ label: 'collection', value: 'collection' },
	{ label: 'discord.js', value: 'discord.js' },
	{ label: 'proxy', value: 'proxy' },
	{ label: 'rest', value: 'rest' },
	{ label: 'voice', value: 'voice' },
	{ label: 'ws', value: 'ws' },
];

export function SidebarLayout({ packageName, data, children }: PropsWithChildren<Partial<SidebarLayoutProps>>) {
	const router = useRouter();

	const theme = useMantineTheme();
	const { colorScheme, toggleColorScheme } = useMantineColorScheme();
	const dark = colorScheme === 'dark';

	const [opened, setOpened] = useState(false);
	const [openedPicker, setOpenedPicker] = useState(false);

	const { classes } = useStyles({ opened: openedPicker });

	const libraryMenuItems = libraries.map((item) => (
		<Menu.Item key={item.label} component={NextLink} href={`/docs/packages/${item.value}/main`}>
			{item.label}
		</Menu.Item>
	));

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
								<>
									<Menu
										onOpen={() => setOpenedPicker(true)}
										onClose={() => setOpenedPicker(false)}
										radius="xs"
										width="target"
									>
										<Menu.Target>
											<UnstyledButton className={classes.control}>
												<Group position="apart">
													<Group>
														<ThemeIcon size={30}>
															<VscPackage size={20} />
														</ThemeIcon>
														<Text weight="600" size="md">
															{packageName}
														</Text>
													</Group>
													<VscChevronDown className={classes.icon} size={20} />
												</Group>
											</UnstyledButton>
										</Menu.Target>
										<Menu.Dropdown>{libraryMenuItems}</Menu.Dropdown>
									</Menu>
								</>
							</Navbar.Section>

							<Navbar.Section p="xs" grow component={ScrollArea}>
								<SidebarItems members={data.members} setOpened={setOpened} />
							</Navbar.Section>
						</>
					) : null}
				</Navbar>
			}
			// footer={
			// 	<Footer height={60} p="md">
			// 		Application footer
			// 	</Footer>
			// }
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
						minHeight: 'calc(100vh - 150px)',
						zIndex: 1,
						background: theme.colorScheme === 'dark' ? theme.colors.dark![8] : theme.colors.gray![0],
					}}
					p="sm"
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
							paddingRight: 14,
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
