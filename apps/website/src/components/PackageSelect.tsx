import { VscChevronDown } from '@react-icons/all-files/vsc/VscChevronDown';
import { VscPackage } from '@react-icons/all-files/vsc/VscPackage';
import { Menu, MenuButton, MenuItem, useMenuState } from 'ariakit/menu';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { PACKAGES } from '~/util/constants';

export function PackageSelect() {
	const pathname = usePathname();
	const packageName = pathname?.split('/').slice(3, 4)[0];

	const packageMenu = useMenuState({ gutter: 8, sameWidth: true, fitViewport: true });

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

	return (
		<>
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
						className={`transform transition duration-150 ease-in-out ${packageMenu.open ? 'rotate-180' : 'rotate-0'}`}
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
		</>
	);
}
