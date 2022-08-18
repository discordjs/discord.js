import { createStyles, UnstyledButton, Group, Text } from '@mantine/core';
import Link from 'next/link';
import type { Dispatch, SetStateAction } from 'react';
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
			return <VscSymbolClass />;
		case 'Enums':
			return <VscSymbolEnum />;
		case 'Interfaces':
			return <VscSymbolInterface />;
		case 'Types':
			return <VscSymbolField />;
		case 'Variables':
			return <VscSymbolVariable />;
		case 'Functions':
			return <VscSymbolMethod />;
	}
}

const useStyles = createStyles((theme) => ({
	link: {
		fontWeight: 500,
		display: 'block',
		padding: 5,
		paddingLeft: 31,
		marginLeft: 25,
		fontSize: theme.fontSizes.sm,
		color: theme.colorScheme === 'dark' ? theme.colors.dark![0] : theme.colors.gray![7],
		borderLeft: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark![4] : theme.colors.gray![3]}`,

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
	const { classes } = useStyles();
	const groupItems = groupMembers(members);

	return (
		<>
			{(Object.keys(groupItems) as (keyof GroupedMembers)[])
				.filter((group) => groupItems[group].length)
				.map((group, idx) => (
					<Section key={idx} title={group} icon={resolveIcon(group)}>
						{groupItems[group].map((member, i) => (
							<Link key={i} href={member.path} passHref>
								<UnstyledButton className={classes.link} component="a" onClick={() => setOpened((o) => !o)}>
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
								</UnstyledButton>
							</Link>
						))}
					</Section>
				))}
		</>
	);
}
