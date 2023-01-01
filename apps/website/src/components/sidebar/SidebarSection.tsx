'use client';

import type { ApiItemKind } from '@microsoft/api-extractor-model';
import { VscSymbolClass } from '@react-icons/all-files/vsc/VscSymbolClass';
import { VscSymbolEnum } from '@react-icons/all-files/vsc/VscSymbolEnum';
import { VscSymbolField } from '@react-icons/all-files/vsc/VscSymbolField';
import { VscSymbolInterface } from '@react-icons/all-files/vsc/VscSymbolInterface';
import { VscSymbolMethod } from '@react-icons/all-files/vsc/VscSymbolMethod';
import { VscSymbolVariable } from '@react-icons/all-files/vsc/VscSymbolVariable';
import Link from 'next/link';
import { useState } from 'react';
import { Section } from '../Section';
import { useNav } from '~/contexts/nav';

export interface SidebarSectionItemData {
	href: string;
	kind: ApiItemKind;
	name: string;
	overloadIndex?: number | undefined;
}

function resolveIcon(item: string) {
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

export function SidebarSection({ group, items }: { group: string; items: SidebarSectionItemData[] }) {
	const icon = resolveIcon(group);
	const [asPathWithoutQueryAndAnchor, setAsPathWithoutQueryAndAnchor] = useState('');
	const { setOpened } = useNav();

	return (
		<Section icon={icon} title={group}>
			{items.map((item, idx) => (
				<Link
					className={`dark:border-dark-100 border-light-800 focus:ring-width-2 focus:ring-blurple ml-5 flex flex-col border-l p-[5px] pl-6 outline-0 focus:rounded focus:border-0 focus:ring ${
						asPathWithoutQueryAndAnchor === item.href
							? 'bg-blurple text-white'
							: 'dark:hover:bg-dark-200 dark:active:bg-dark-100 hover:bg-light-700 active:bg-light-800'
					}`}
					href={item.href}
					key={idx}
					onClick={() => setOpened(false)}
					title={item.name}
				>
					<div className="flex flex-row place-items-center gap-2 lg:text-sm">
						<span className="truncate">{item.name}</span>
						{item.overloadIndex && item.overloadIndex > 1 ? (
							<span className="text-xs">{item.overloadIndex}</span>
						) : null}
					</div>
				</Link>
			))}
		</Section>
	);
}
