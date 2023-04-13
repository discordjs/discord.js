import { VscChevronDown } from '@react-icons/all-files/vsc/VscChevronDown';
import { VscPackage } from '@react-icons/all-files/vsc/VscPackage';
import { Menu, MenuButton, MenuItem, useMenuState } from 'ariakit/menu';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { PACKAGES } from '~/util/constants';

export default function PackageSelect() {
	const pathname = usePathname();
	const packageName = pathname?.split('/').slice(3, 4)[0];

	const packageMenu = useMenuState({ gutter: 8, sameWidth: true, fitViewport: true });

	const packageMenuItems = useMemo(
		() => [
			<a href="https://old.discordjs.dev/#/docs/discord.js" key="discord.js">
				<MenuItem
					className="my-0.5 rounded bg-white p-3 text-sm outline-0 active:bg-light-800 dark:bg-dark-600 hover:bg-light-700 focus:ring focus:ring-width-2 focus:ring-blurple dark:active:bg-dark-400 dark:hover:bg-dark-500"
					id="discord-js"
					onClick={() => packageMenu.setOpen(false)}
					state={packageMenu}
				>
					discord.js
				</MenuItem>
			</a>,
			...PACKAGES.map((pkg, idx) => (
				<Link href={`/docs/packages/${pkg}/main`} key={`${pkg}-${idx}`}>
					<MenuItem
						className="my-0.5 rounded bg-white p-3 text-sm outline-0 active:bg-light-800 dark:bg-dark-600 hover:bg-light-700 focus:ring focus:ring-width-2 focus:ring-blurple dark:active:bg-dark-400 dark:hover:bg-dark-500"
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
				className="rounded bg-light-600 p-3 outline-0 active:bg-light-800 dark:bg-dark-400 hover:bg-light-700 focus:ring focus:ring-width-2 focus:ring-blurple dark:active:bg-dark-400 dark:hover:bg-dark-300"
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
				className="z-20 flex flex-col border border-light-800 rounded bg-white p-1 outline-0 dark:border-dark-100 dark:bg-dark-600 focus:ring focus:ring-width-2 focus:ring-blurple"
				state={packageMenu}
			>
				{packageMenuItems}
			</Menu>
		</>
	);
}
