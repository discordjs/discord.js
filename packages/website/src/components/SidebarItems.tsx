import { createStyles, Group, Text, NavLink, Box } from '@mantine/core';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { type Dispatch, type SetStateAction, useEffect, useState, useMemo } from 'react';
import {
	VscSymbolClass,
	VscSymbolEnum,
	VscSymbolInterface,
	VscSymbolField,
	VscSymbolVariable,
	VscSymbolMethod,
} from 'react-icons/vsc';
import { Section } from './Section';
import type { GroupedMembers, Members } from './SidebarLayout';

function groupMembers(members: Members): GroupedMembers {
	const Classes: Members = [];
	const Enums: Members = [];
	const Interfaces: Members = [];
	const Types: Members = [];
	const Variables: Members = [];
	const Functions: Members = [];

	for (const member of members) {
		switch (member.kind) {
			case 'Class':
				Classes.push(member);
				break;
			case 'Enum':
				Enums.push(member);
				break;
			case 'Interface':
				Interfaces.push(member);
				break;
			case 'TypeAlias':
				Types.push(member);
				break;
			case 'Variable':
				Variables.push(member);
				break;
			case 'Function':
				Functions.push(member);
				break;
			default:
				break;
		}
	}

	return { Classes, Functions, Enums, Interfaces, Types, Variables };
}

function resolveIcon(item: keyof GroupedMembers) {
	switch (item) {
		case 'Classes':
			return <VscSymbolClass size={20} />;
		case 'Enums':
			return <VscSymbolEnum size={20} />;
		case 'Interfaces':
			return <VscSymbolInterface size={20} />;
		case 'Types':
			return <VscSymbolField size={20} />;
		case 'Variables':
			return <VscSymbolVariable size={20} />;
		default:
			return <VscSymbolMethod size={20} />;
	}
}

const useStyles = createStyles((theme) => ({
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	link: {
		...theme.fn.focusStyles(),
		fontWeight: 500,
		display: 'block',
		width: 'unset',
		padding: 5,
		paddingLeft: 31,
		marginLeft: 25,
		fontSize: theme.fontSizes.sm,
		color: theme.colorScheme === 'dark' ? theme.colors.dark![0] : theme.colors.gray![7],
		borderLeft: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark![4] : theme.colors.gray![3]}`,

		'&[data-active]': {
			'&:hover': {
				color: theme.white,
			},
		},

		'&:hover': {
			backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark![6] : theme.colors.gray![0],
			color: theme.colorScheme === 'dark' ? theme.white : theme.black,
		},
	},
}));

export function SidebarItems({
	members,
	setOpened,
}: {
	members: Members;
	setOpened: Dispatch<SetStateAction<boolean>>;
}) {
	const router = useRouter();
	const [asPathWithoutQueryAndAnchor, setAsPathWithoutQueryAndAnchor] = useState('');
	const { classes } = useStyles();
	const groupItems = useMemo(() => groupMembers(members), [members]);

	useEffect(() => {
		setAsPathWithoutQueryAndAnchor(router.asPath.split('?')[0]?.split('#')[0] ?? '');
	}, [router.asPath]);

	return (
		<Box sx={(theme) => ({ paddingBottom: 48, [theme.fn.smallerThan('md')]: { paddingBottom: 128 } })}>
			{(Object.keys(groupItems) as (keyof GroupedMembers)[])
				.filter((group) => groupItems[group].length)
				.map((group, idx) => (
					<Section key={idx} title={group} icon={resolveIcon(group)}>
						{groupItems[group].map((member, index) => (
							<Link key={index} href={member.path} passHref prefetch={false}>
								<NavLink
									className={classes.link}
									component="a"
									onClick={() => setOpened((isOpened) => !isOpened)}
									label={
										<Group>
											<Text sx={{ textOverflow: 'ellipsis', overflow: 'hidden' }} className="line-clamp-1">
												{member.name}
											</Text>
											{member.overloadIndex && member.overloadIndex > 1 ? (
												<Text size="xs" color="dimmed">
													{member.overloadIndex}
												</Text>
											) : null}
										</Group>
									}
									active={asPathWithoutQueryAndAnchor === member.path}
									variant="filled"
								/>
							</Link>
						))}
					</Section>
				))}
		</Box>
	);
}
