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

export function SidebarItems({
	members,
	setOpened,
}: {
	members: Members;
	setOpened: Dispatch<SetStateAction<boolean>>;
}) {
	const router = useRouter();
	const [asPathWithoutQueryAndAnchor, setAsPathWithoutQueryAndAnchor] = useState('');
	const groupItems = useMemo(() => groupMembers(members), [members]);

	useEffect(() => {
		setAsPathWithoutQueryAndAnchor(router.asPath.split('?')[0]?.split('#')[0] ?? '');
	}, [router.asPath]);

	return (
		<div className="flex flex-col gap-3 p-3 pb-32 lg:pb-12">
			{(Object.keys(groupItems) as (keyof GroupedMembers)[])
				.filter((group) => groupItems[group].length)
				.map((group, idx) => (
					<Section icon={resolveIcon(group)} key={idx} title={group}>
						{groupItems[group].map((member, index) => (
							<Link href={member.path} key={index} prefetch={false}>
								<a
									className={`dark:border-dark-100 border-light-800 focus:ring-width-2 focus:ring-blurple ml-5 flex flex-col border-l p-[5px] pl-6 outline-0 focus:rounded focus:border-0 focus:ring ${
										asPathWithoutQueryAndAnchor === member.path
											? 'bg-blurple text-white'
											: 'dark:hover:bg-dark-200 dark:active:bg-dark-100 hover:bg-light-700 active:bg-light-800'
									}`}
									onClick={() => setOpened(false)}
									title={member.name}
								>
									<div className="flex flex-row place-items-center gap-2 lg:text-sm">
										<span className="truncate">{member.name}</span>
										{member.overloadIndex && member.overloadIndex > 1 ? (
											<span className="text-xs">{member.overloadIndex}</span>
										) : null}
									</div>
								</a>
							</Link>
						))}
					</Section>
				))}
		</div>
	);
}
