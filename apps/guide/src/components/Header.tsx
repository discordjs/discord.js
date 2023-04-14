'use client';

import { VscGithubInverted } from '@react-icons/all-files/vsc/VscGithubInverted';
import { VscMenu } from '@react-icons/all-files/vsc/VscMenu';
import { Button } from 'ariakit/button';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fragment, useMemo } from 'react';
import { useNav } from '~/contexts/nav';

const ThemeSwitcher = dynamic(async () => import('./ThemeSwitcher'));

export default function Header() {
	const pathname = usePathname();
	const { setOpened } = useNav();

	const pathElements = useMemo(
		() =>
			pathname
				.split('/')
				.slice(1)
				.map((path, idx, original) => (
					<Link
						className="rounded outline-0 hover:underline focus:ring focus:ring-width-2 focus:ring-blurple"
						href={`/${original.slice(0, idx + 1).join('/')}`}
						key={`${path}-${idx}`}
					>
						{path}
					</Link>
				)),
		[pathname],
	);

	const breadcrumbs = useMemo(
		() =>
			pathElements.flatMap((el, idx, array) => {
				if (idx === 0) {
					return (
						<Fragment key={`${el.key}-${idx}`}>
							<div className="mx-2">/</div>
							{el}
							<div className="mx-2">/</div>
						</Fragment>
					);
				}

				if (idx !== array.length - 1) {
					return (
						<Fragment key={`${el.key}-${idx}`}>
							{el}
							<div className="mx-2">/</div>
						</Fragment>
					);
				}

				return <Fragment key={`${el.key}-${idx}`}>{el}</Fragment>;
			}),
		[pathElements],
	);

	return (
		<header className="sticky top-4 z-20 border border-light-900 rounded-md bg-white/75 shadow backdrop-blur-md dark:border-dark-100 dark:bg-dark-600/75">
			<div className="block h-16 px-6">
				<div className="h-full flex flex-row place-content-between place-items-center gap-8">
					<Button
						aria-label="Menu"
						className="h-6 w-6 flex flex-row transform-gpu cursor-pointer select-none appearance-none place-items-center border-0 rounded bg-transparent p-0 text-sm font-semibold leading-none no-underline outline-0 lg:hidden active:translate-y-px focus:ring focus:ring-width-2 focus:ring-blurple"
						onClick={() => setOpened((open) => !open)}
					>
						<VscMenu size={24} />
					</Button>
					<div className="hidden lg:flex lg:flex-row lg:overflow-hidden">{breadcrumbs}</div>
					<div className="flex flex-row place-items-center gap-4">
						<Button
							aria-label="GitHub"
							as="a"
							className="h-6 w-6 flex flex-row transform-gpu cursor-pointer select-none appearance-none place-items-center border-0 rounded rounded-full bg-transparent p-0 text-sm font-semibold leading-none no-underline outline-0 active:translate-y-px focus:ring focus:ring-width-2 focus:ring-blurple"
							href="https://github.com/discordjs/discord.js"
							rel="noopener noreferrer"
							target="_blank"
						>
							<VscGithubInverted size={24} />
						</Button>
						<ThemeSwitcher />
					</div>
				</div>
			</div>
		</header>
	);
}
