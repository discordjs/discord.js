import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { VscChevronDown, VscChevronRight } from 'react-icons/vsc';
import type { ItemListProps } from './ItemSidebar';
import type { getMembers } from '~/util/parse.server';

export interface ListSidebarSectionProps {
	members: ReturnType<typeof getMembers>;
	selectedMember?: string | undefined;
	title: string;
}

interface GroupedMembers {
	Classes: ItemListProps['data']['members'];
	Enums: ItemListProps['data']['members'];
	Interfaces: ItemListProps['data']['members'];
	Types: ItemListProps['data']['members'];
	Variables: ItemListProps['data']['members'];
}

function groupMembers(members: ItemListProps['data']['members']): GroupedMembers {
	const Classes: ItemListProps['data']['members'] = [];
	const Enums: ItemListProps['data']['members'] = [];
	const Interfaces: ItemListProps['data']['members'] = [];
	const Types: ItemListProps['data']['members'] = [];
	const Variables: ItemListProps['data']['members'] = [];

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
			default:
				break;
		}
	}

	return { Classes, Enums, Interfaces, Types, Variables };
}

export function ListSidebarSection({ members, selectedMember, title }: ListSidebarSectionProps) {
	const [showList, setShowList] = useState(true);

	return (
		<div>
			<h3
				className="flex items-center dark:text-white m-0 text-sm font-semibold gap-2"
				onClick={() => setShowList(!showList)}
			>
				{showList ? <VscChevronDown size={20} /> : <VscChevronRight size={20} />}
				{title}
			</h3>
			<AnimatePresence exitBeforeEnter initial={false}>
				{showList ? (
					<motion.div
						className="ml-10 mt-2 space-y-3"
						transition={{ duration: 0.5, ease: [0.04, 0.62, 0.23, 0.98] }}
						key="content"
						initial="collapsed"
						animate="open"
						exit="collapsed"
						variants={{
							open: {
								opacity: 1,
								height: 'auto',
							},
							collapsed: {
								opacity: 0,
								height: 0,
							},
						}}
					>
						{members.map((member, i) => (
							<div
								key={i}
								className="flex gap-2 whitespace-pre-wrap no-underline break-all text-blue-500 dark:text-blue-300"
							>
								<Link href={member.path}>
									<a
										className={`no-underline m-0 text-sm ${
											selectedMember === member.name
												? 'text-blue-500 dark:text-blue-300 font-semibold'
												: 'text-gray-500 dark:text-white hover:text-dark-100 dark:hover:text-black'
										}`}
									>
										{member.name}
									</a>
								</Link>
							</div>
						))}
					</motion.div>
				) : null}
			</AnimatePresence>
		</div>
	);
}

export function ListSidebar({ members, selectedMember }: ListSidebarSectionProps) {
	const groupItems = groupMembers(members);

	return (
		<div className="space-y-2">
			{Object.keys(groupItems).map((group, i) => (
				<ListSidebarSection
					key={i}
					members={groupItems[group as keyof GroupedMembers]}
					selectedMember={selectedMember}
					title={group}
				/>
			))}
		</div>
	);
}
