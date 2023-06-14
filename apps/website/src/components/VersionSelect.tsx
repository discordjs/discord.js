'use client';

import { VscChevronDown } from '@react-icons/all-files/vsc/VscChevronDown';
import { VscVersions } from '@react-icons/all-files/vsc/VscVersions';
import { Menu, MenuButton, MenuItem, useMenuState } from 'ariakit/menu';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import useSWR from 'swr';
import { fetcher } from '~/util/fetcher';

export default function VersionSelect() {
	const pathname = usePathname();
	const packageName = pathname?.split('/').slice(3, 4)[0];
	const branchName = pathname?.split('/').slice(4, 5)[0];

	const { data: versions } = useSWR<string[]>(`https://docs.discordjs.dev/api/info?package=${packageName}`, fetcher);
	const versionMenu = useMenuState({ gutter: 8, sameWidth: true, fitViewport: true });

	const versionMenuItems = useMemo(
		() =>
			versions
				?.map((item, idx) => (
					<Link href={`/docs/packages/${packageName}/${item}`} key={`${item}-${idx}`}>
						<MenuItem
							className="my-0.5 rounded bg-white p-3 text-sm outline-none active:bg-light-800 dark:bg-dark-600 hover:bg-light-700 focus:ring focus:ring-width-2 focus:ring-blurple dark:active:bg-dark-400 dark:hover:bg-dark-500"
							onClick={() => versionMenu.setOpen(false)}
							state={versionMenu}
						>
							{item}
						</MenuItem>
					</Link>
				))
				.reverse() ?? [],
		[versions, packageName, versionMenu],
	);

	return (
		<>
			<MenuButton
				className="rounded bg-light-600 p-3 outline-none active:bg-light-800 dark:bg-dark-400 hover:bg-light-700 focus:ring focus:ring-width-2 focus:ring-blurple dark:active:bg-dark-400 dark:hover:bg-dark-300"
				state={versionMenu}
			>
				<div className="flex flex-row place-content-between place-items-center">
					<div className="flex flex-row place-items-center gap-3">
						<VscVersions size={20} />
						<span className="font-semibold">{branchName}</span>
					</div>
					<VscChevronDown
						className={`transform transition duration-150 ease-in-out ${versionMenu.open ? 'rotate-180' : 'rotate-0'}`}
						size={20}
					/>
				</div>
			</MenuButton>
			<Menu
				className="z-20 flex flex-col border border-light-800 rounded bg-white p-1 outline-none dark:border-dark-100 dark:bg-dark-600 focus:ring focus:ring-width-2 focus:ring-blurple"
				state={versionMenu}
			>
				{versionMenuItems}
			</Menu>
		</>
	);
}
