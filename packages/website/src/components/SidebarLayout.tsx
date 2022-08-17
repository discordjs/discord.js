import {
	useMantineTheme,
	AppShell,
	Navbar,
	MediaQuery,
	Aside,
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
} from '@mantine/core';
import { NextLink } from '@mantine/next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { type PropsWithChildren, useState } from 'react';
import { VscChevronDown, VscPackage } from 'react-icons/vsc';
import { WiDaySunny, WiNightClear } from 'react-icons/wi';
import { SidebarItems } from './SidebarItems';
import { TableOfContentsItems } from './TableOfContentsItems';
import type { DocClass } from '~/DocModel/DocClass';
import type { DocItem } from '~/DocModel/DocItem';
import type { findMember } from '~/util/model.server';
import type { getMembers } from '~/util/parse.server';

export interface SidebarLayoutProps {
	packageName: string;
	data: {
		members: ReturnType<typeof getMembers>;
		member: ReturnType<typeof findMember>;
	};

	selectedMember?: ReturnType<DocItem['toJSON']> | undefined;
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
		<Menu.Item key={item.label} component={NextLink} href={`/docs/main/packages/${item.value}`}>
			{item.label}
		</Menu.Item>
	));

	const asPathWithoutQuery = router.asPath.split('?')[0];
	const breadcrumbs = asPathWithoutQuery?.split('/').map((path, idx, original) => (
		<Link key={idx} href={original.slice(0, idx + 1).join('/')} passHref>
			<Anchor component="a">{path}</Anchor>
		</Link>
	));

	return (
		<AppShell
			styles={{
				main: {
					background: theme.colorScheme === 'dark' ? theme.colors.dark![8] : theme.colors.gray![0],
				},
			}}
			navbarOffsetBreakpoint="sm"
			asideOffsetBreakpoint="sm"
			navbar={
				<Navbar hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 200, lg: 300 }}>
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
														<ThemeIcon variant="outline" size={30}>
															<VscPackage />
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
			aside={
				packageName && data?.member && data.member.kind === 'Class' ? (
					<MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
						<Aside hiddenBreakpoint="sm" width={{ sm: 200, lg: 300 }}>
							<ScrollArea p="xs">
								<TableOfContentsItems
									members={(data.member as unknown as ReturnType<DocClass['toJSON']>).methods}
								></TableOfContentsItems>
							</ScrollArea>
						</Aside>
					</MediaQuery>
				) : (
					<></>
				)
			}
			// footer={
			// 	<Footer height={60} p="md">
			// 		Application footer
			// 	</Footer>
			// }
			header={
				<Header height={70} p="md">
					<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
						<div>
							<MediaQuery largerThan="sm" styles={{ display: 'none' }}>
								<Burger
									opened={opened}
									onClick={() => setOpened((o) => !o)}
									size="sm"
									color={theme.colors.gray![6]}
									mr="xl"
								/>
							</MediaQuery>

							<MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
								<Breadcrumbs>{breadcrumbs}</Breadcrumbs>
							</MediaQuery>
						</div>
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
			{children}
		</AppShell>
	);
}
