'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import type { SidebarSectionItemData } from './sidebar/SidebarSection';
import { SidebarSection } from './sidebar/SidebarSection';
import { useNav } from '~/contexts/nav';

interface GroupedMembers {
	Classes: SidebarSectionItemData[];
	Enums: SidebarSectionItemData[];
	Functions: SidebarSectionItemData[];
	Interfaces: SidebarSectionItemData[];
	Types: SidebarSectionItemData[];
	Variables: SidebarSectionItemData[];
}

function groupMembers(members: readonly SidebarSectionItemData[]): GroupedMembers {
	const Classes: SidebarSectionItemData[] = [];
	const Enums: SidebarSectionItemData[] = [];
	const Interfaces: SidebarSectionItemData[] = [];
	const Types: SidebarSectionItemData[] = [];
	const Variables: SidebarSectionItemData[] = [];
	const Functions: SidebarSectionItemData[] = [];

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

export function SidebarItems({ members }: { members: SidebarSectionItemData[] }) {
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
					<SidebarSection group={group} items={groupItems[group]} key={idx} />
				))}
		</div>
	);
}
