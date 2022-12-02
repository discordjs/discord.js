'use client';

import type { getMembers } from '@discordjs/api-extractor-utils';
import { Section } from '@discordjs/ui';
import { VscSymbolClass } from '@react-icons/all-files/vsc/VscSymbolClass';
import { VscSymbolEnum } from '@react-icons/all-files/vsc/VscSymbolEnum';
import { VscSymbolField } from '@react-icons/all-files/vsc/VscSymbolField';
import { VscSymbolInterface } from '@react-icons/all-files/vsc/VscSymbolInterface';
import { VscSymbolMethod } from '@react-icons/all-files/vsc/VscSymbolMethod';
import { VscSymbolVariable } from '@react-icons/all-files/vsc/VscSymbolVariable';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo, useState, useEffect } from 'react';
import { useNav } from '~/contexts/nav';

type Members = ReturnType<typeof getMembers>;

interface GroupedMembers {
	Classes: Members;
	Enums: Members;
	Functions: Members;
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

export function SidebarItems({ members }: { members: Members }) {
	const pathname = usePathname();
	const [asPathWithoutQueryAndAnchor, setAsPathWithoutQueryAndAnchor] = useState('');
	const { setOpened } = useNav();

	useEffect(() => {
		setAsPathWithoutQueryAndAnchor(pathname?.split('?')[0]?.split('#')[0] ?? '');
	}, [pathname]);

	const groupItems = useMemo(() => groupMembers(members), [members]);

	return (
		<div className="flex flex-col gap-3 p-3 pb-32 lg:pb-12">
			{(Object.keys(groupItems) as (keyof GroupedMembers)[])
				.filter((group) => groupItems[group].length)
				.map((group, idx) => (
					<Section icon={resolveIcon(group)} key={idx} title={group}>
						{groupItems[group].map((member, index) => (
							<Link
								className={`dark:border-dark-100 border-light-800 focus:ring-width-2 focus:ring-blurple ml-5 flex flex-col border-l p-[5px] pl-6 outline-0 focus:rounded focus:border-0 focus:ring ${
									asPathWithoutQueryAndAnchor === member.path
										? 'bg-blurple text-white'
										: 'dark:hover:bg-dark-200 dark:active:bg-dark-100 hover:bg-light-700 active:bg-light-800'
								}`}
								href={member.path}
								key={index}
								onClick={() => setOpened(false)}
								title={member.name}
							>
								<div className="flex flex-row place-items-center gap-2 lg:text-sm">
									<span className="truncate">{member.name}</span>
									{member.overloadIndex && member.overloadIndex > 1 ? (
										<span className="text-xs">{member.overloadIndex}</span>
									) : null}
								</div>
							</Link>
						))}
					</Section>
				))}
		</div>
	);
}
