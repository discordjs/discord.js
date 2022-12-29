'use server';

import { generatePath } from '@discordjs/api-extractor-utils';
import type { ApiItem } from '@microsoft/api-extractor-model';
import { useMemo } from 'react';
import type { SidebarSectionItemData } from './sidebar/SidebarSection';
import { SidebarSection } from './sidebar/SidebarSection';

interface GroupedMembers {
	Classes: SidebarSectionItemData[];
	Enums: SidebarSectionItemData[];
	Functions: SidebarSectionItemData[];
	Interfaces: SidebarSectionItemData[];
	Types: SidebarSectionItemData[];
	Variables: SidebarSectionItemData[];
}

function serializeIntoSidebarItemData(item: ApiItem): SidebarSectionItemData {
	return {
		name: item.displayName,
		href: generatePath(item.getHierarchy(), item.displayName),
		overloadIndex: 'overloadIndex' in item ? (item.overloadIndex as number) : undefined,
	};
}

function groupMembers(members: readonly ApiItem[]): GroupedMembers {
	const Classes: SidebarSectionItemData[] = [];
	const Enums: SidebarSectionItemData[] = [];
	const Interfaces: SidebarSectionItemData[] = [];
	const Types: SidebarSectionItemData[] = [];
	const Variables: SidebarSectionItemData[] = [];
	const Functions: SidebarSectionItemData[] = [];

	for (const member of members) {
		switch (member.kind) {
			case 'Class':
				Classes.push(serializeIntoSidebarItemData(member));
				break;
			case 'Enum':
				Enums.push(serializeIntoSidebarItemData(member));
				break;
			case 'Interface':
				Interfaces.push(serializeIntoSidebarItemData(member));
				break;
			case 'TypeAlias':
				Types.push(serializeIntoSidebarItemData(member));
				break;
			case 'Variable':
				Variables.push(serializeIntoSidebarItemData(member));
				break;
			case 'Function':
				Functions.push(serializeIntoSidebarItemData(member));
				break;
			default:
				break;
		}
	}

	return { Classes, Functions, Enums, Interfaces, Types, Variables };
}

export function SidebarItems({ members }: { members: readonly ApiItem[] }) {
	// const pathname = usePathname();
	// const [asPathWithoutQueryAndAnchor, setAsPathWithoutQueryAndAnchor] = useState('');
	// const { setOpened } = useNav();

	// useEffect(() => {
	// 	setAsPathWithoutQueryAndAnchor(pathname?.split('?')[0]?.split('#')[0] ?? '');
	// }, [pathname]);

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
