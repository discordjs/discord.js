import Link from 'next/link';
import {
	VscSymbolClass,
	VscSymbolEnum,
	VscSymbolField,
	VscSymbolInterface,
	VscSymbolMethod,
	VscSymbolVariable,
} from 'react-icons/vsc';
import type { ItemListProps } from './ItemSidebar';
import { Section } from './Section';

export type Members = ItemListProps['data']['members'];

export interface ListSidebarSectionProps {
	members: Members;
	selectedMember?: string | undefined;
	title: string;
}

interface GroupedMembers {
	Classes: Members;
	Functions: Members;
	Enums: Members;
	Interfaces: Members;
	Types: Members;
	Variables: Members;
}

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

export function ListSidebar({ members, selectedMember }: ListSidebarSectionProps) {
	const groupItems = groupMembers(members);

	return (
		<>
			{(Object.keys(groupItems) as (keyof GroupedMembers)[])
				.filter((group) => groupItems[group].length)
				.map((group, i) => (
					<Section iconElement={resolveIcon(group)} key={i} title={group} showSeparator={false}>
						<div className="space-y-2">
							{groupItems[group].map((member, i) => (
								<div
									key={i}
									className="flex gap-2 whitespace-pre-wrap no-underline break-all text-blue-500 dark:text-blue-300"
								>
									<Link href={member.path}>
										<a
											className={`no-underline m-0 text-sm font-semibold ${
												selectedMember === member.name
													? 'text-blue-500 dark:text-blue-300'
													: 'text-gray-500 dark:text-gray-300 hover:text-dark-100 dark:hover:text-white'
											}`}
										>
											{member.name}
										</a>
									</Link>
								</div>
							))}
						</div>
					</Section>
				))}
		</>
	);
}
