'use client';

import type { getMembers } from '@discordjs/api-extractor-utils';
import { Menu, MenuButton, MenuItem, useMenuState } from 'ariakit/menu';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { VscChevronDown, VscPackage, VscVersions } from 'react-icons/vsc';
import useSWR from 'swr';
import { SidebarItems } from './SidebarItems';
import { useNav } from '~/contexts/nav';
import { PACKAGES } from '~/util/constants';
import { fetcher } from '~/util/fetcher';

export function Nav({ members }: { members: ReturnType<typeof getMembers> }) {
	// eslint-disable-next-line @typescript-eslint/unbound-method
	const { opened, setOpened } = useNav();
	const pathname = usePathname();
	const packageName = pathname?.split('/').slice(3, 4)[0];
	const branchName = pathname?.split('/').slice(4, 5)[0];

	const { data: versions } = useSWR<string[]>(`https://docs.discordjs.dev/api/info?package=${packageName}`, fetcher);

	const packageMenu = useMenuState({ gutter: 8, sameWidth: true, fitViewport: true });
	const versionMenu = useMenuState({ gutter: 8, sameWidth: true, fitViewport: true });

	const [asPathWithoutQueryAndAnchor, setAsPathWithoutQueryAndAnchor] = useState('');

	useEffect(() => {
		setAsPathWithoutQueryAndAnchor(pathname?.split('?')[0]?.split('#')[0] ?? '');
	}, [pathname]);

	const packageMenuItems = useMemo(
		() => [
			<a href="https://discord.js.org/#/docs/discord.js" key="discord.js">
				<MenuItem
					className="hover:bg-light-700 active:bg-light-800 dark:bg-dark-600 dark:hover:bg-dark-500 dark:active:bg-dark-400 focus:ring-width-2 focus:ring-blurple my-0.5 rounded bg-white p-3 text-sm outline-0 focus:ring"
					id="discord-js"
					onClick={() => packageMenu.setOpen(false)}
					state={packageMenu}
				>
					discord.js
				</MenuItem>
			</a>,
			...PACKAGES.map((pkg) => (
				<Link href={`/docs/packages/${pkg}/main`} key={pkg}>
					<MenuItem
						className="hover:bg-light-700 active:bg-light-800 dark:bg-dark-600 dark:hover:bg-dark-500 dark:active:bg-dark-400 focus:ring-width-2 focus:ring-blurple my-0.5 rounded bg-white p-3 text-sm outline-0 focus:ring"
						id={pkg}
						onClick={() => packageMenu.setOpen(false)}
						state={packageMenu}
					>
						{pkg}
					</MenuItem>
				</Link>
			)),
		],
		[packageMenu],
	);

	const versionMenuItems = useMemo(
		() =>
			versions
				?.map((item) => (
					<Link href={`/docs/packages/${packageName}/${item}`} key={item}>
						<MenuItem
							className="hover:bg-light-700 active:bg-light-800 dark:bg-dark-600 dark:hover:bg-dark-500 dark:active:bg-dark-400 focus:ring-width-2 focus:ring-blurple my-0.5 rounded bg-white p-3 text-sm outline-0 focus:ring"
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
		<nav
			className={`dark:bg-dark-600 dark:border-dark-100 border-light-800 fixed top-[73px] left-0 bottom-0 z-20 h-[calc(100vh_-_73px)] w-full border-r bg-white ${
				opened ? 'block' : 'hidden'
			} lg:w-76 lg:max-w-76 lg:block`}
		>
			<Scrollbars
				autoHide
				hideTracksWhenNotNeeded
				renderThumbVertical={(props) => <div {...props} className="dark:bg-dark-100 bg-light-900 z-30 rounded" />}
				renderTrackVertical={(props) => (
					<div {...props} className="absolute top-0.5 right-0.5 bottom-0.5 z-30 w-1.5 rounded" />
				)}
				universal
			>
				<div className="flex flex-col gap-3 px-3 pt-3">
					<MenuButton
						className="bg-light-600 hover:bg-light-700 active:bg-light-800 dark:bg-dark-600 dark:hover:bg-dark-500 dark:active:bg-dark-400 focus:ring-width-2 focus:ring-blurple rounded p-3 outline-0 focus:ring"
						state={packageMenu}
					>
						<div className="flex flex-row place-content-between place-items-center">
							<div className="flex flex-row place-items-center gap-3">
								<VscPackage size={20} />
								<span className="font-semibold">{packageName}</span>
							</div>
							<VscChevronDown
								className={`transform transition duration-150 ease-in-out ${
									packageMenu.open ? 'rotate-180' : 'rotate-0'
								}`}
								size={20}
							/>
						</div>
					</MenuButton>
					<Menu
						className="dark:bg-dark-600 border-light-800 dark:border-dark-100 focus:ring-width-2 focus:ring-blurple z-20 flex flex-col rounded border bg-white p-1 outline-0 focus:ring"
						state={packageMenu}
					>
						{packageMenuItems}
					</Menu>
					<MenuButton
						className="bg-light-600 hover:bg-light-700 active:bg-light-800 dark:bg-dark-600 dark:hover:bg-dark-500 dark:active:bg-dark-400 focus:ring-width-2 focus:ring-blurple rounded p-3 outline-0 focus:ring"
						state={versionMenu}
					>
						<div className="flex flex-row place-content-between place-items-center">
							<div className="flex flex-row place-items-center gap-3">
								<VscVersions size={20} />
								<span className="font-semibold">{branchName}</span>
							</div>
							<VscChevronDown
								className={`transform transition duration-150 ease-in-out ${
									versionMenu.open ? 'rotate-180' : 'rotate-0'
								}`}
								size={20}
							/>
						</div>
					</MenuButton>
					<Menu
						className="dark:bg-dark-600 border-light-800 dark:border-dark-100 focus:ring-width-2 focus:ring-blurple z-20 flex flex-col rounded border bg-white p-1 outline-0 focus:ring"
						state={versionMenu}
					>
						{versionMenuItems}
					</Menu>
				</div>
				<SidebarItems asPath={asPathWithoutQueryAndAnchor} members={members} setOpened={setOpened} />
			</Scrollbars>
		</nav>
	);
}
