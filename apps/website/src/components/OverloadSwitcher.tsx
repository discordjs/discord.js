'use client';

import { VscChevronDown } from '@react-icons/all-files/vsc/VscChevronDown';
import { VscVersions } from '@react-icons/all-files/vsc/VscVersions';
import { Menu, MenuButton, MenuItem, useMenuState } from 'ariakit/menu';
import type { PropsWithChildren, ReactNode } from 'react';
import { useMemo, useState } from 'react';

export interface OverloadSwitcherProps {
	overloads: ReactNode[];
}

export default function OverloadSwitcher({ overloads, children }: PropsWithChildren<{ overloads: ReactNode[] }>) {
	const [overloadIndex, setOverloadIndex] = useState(1);
	const overloadedNode = overloads[overloadIndex - 1]!;
	const menu = useMenuState({ gutter: 8, sameWidth: true, fitViewport: true });

	const menuItems = useMemo(
		() =>
			overloads.map((_, idx) => (
				<MenuItem
					className="hover:bg-light-700 active:bg-light-800 dark:bg-dark-600 dark:hover:bg-dark-500 dark:active:bg-dark-400 focus:ring-width-2 focus:ring-blurple my-0.5 cursor-pointer rounded bg-white p-3 text-sm outline-0 focus:ring"
					key={idx}
					onClick={() => setOverloadIndex(idx + 1)}
				>
					{`Overload ${idx + 1}`}
				</MenuItem>
			)),
		[overloads],
	);

	return (
		<div className="flex flex-col place-items-start gap-2">
			<MenuButton
				className="bg-light-700 hover:bg-light-800 active:bg-light-800 dark:bg-dark-600 dark:hover:bg-dark-500 dark:active:bg-dark-400 focus:ring-width-2 focus:ring-blurple rounded p-3 outline-0 focus:ring"
				state={menu}
			>
				<div className="flex flex-row place-content-between place-items-center gap-2">
					<VscVersions size={20} />
					<div>
						<span className="font-semibold">{`Overload ${overloadIndex}`}</span>
						{` of ${overloads.length}`}
					</div>
					<VscChevronDown
						className={`transform transition duration-150 ease-in-out ${menu.open ? 'rotate-180' : 'rotate-0'}`}
						size={20}
					/>
				</div>
			</MenuButton>
			<Menu
				className="dark:bg-dark-600 border-light-800 dark:border-dark-100 focus:ring-width-2 focus:ring-blurple z-20 flex flex-col rounded border bg-white p-1 outline-0 focus:ring"
				state={menu}
			>
				{menuItems}
			</Menu>
			{children}
			{overloadedNode}
		</div>
	);
}
