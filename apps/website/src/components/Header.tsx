'use client';

import { FiCommand } from '@react-icons/all-files/fi/FiCommand';
// import { VscColorMode } from '@react-icons/all-files/vsc/VscColorMode';
import { VscGithubInverted } from '@react-icons/all-files/vsc/VscGithubInverted';
import { VscMenu } from '@react-icons/all-files/vsc/VscMenu';
import { VscSearch } from '@react-icons/all-files/vsc/VscSearch';
import { Button } from 'ariakit/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
// import { useTheme } from 'next-themes';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { useCmdK } from '~/contexts/cmdK';
import { useNav } from '~/contexts/nav';

export function Header() {
	const pathname = usePathname();
	// eslint-disable-next-line @typescript-eslint/unbound-method
	const { setOpened } = useNav();
	// const { resolvedTheme, setTheme } = useTheme();
	const dialog = useCmdK();
	// const toggleTheme = () => setTheme(resolvedTheme === 'light' ? 'dark' : 'light');
	const [asPathWithoutQueryAndAnchor, setAsPathWithoutQueryAndAnchor] = useState('');

	useEffect(() => {
		setAsPathWithoutQueryAndAnchor(pathname?.split('?')[0]?.split('#')[0] ?? '');
	}, [pathname]);

	const asPathWithoutContainerKey = useMemo(
		() => asPathWithoutQueryAndAnchor?.split(':')[0] ?? '',
		[asPathWithoutQueryAndAnchor],
	);

	const pathElements = useMemo(
		() =>
			asPathWithoutContainerKey
				.split('/')
				.slice(1)
				.map((path, idx, original) => (
					<Link
						className="focus:ring-width-2 focus:ring-blurple rounded outline-0 hover:underline focus:ring"
						href={`/${original.slice(0, idx + 1).join('/')}`}
						key={idx}
					>
						{path}
					</Link>
				)),
		[asPathWithoutContainerKey],
	);

	const breadcrumbs = useMemo(
		() =>
			pathElements.flatMap((el, idx, array) => {
				if (idx === 0) {
					return (
						<Fragment key={idx}>
							<div className="mx-2">/</div>
							{el}
							<div className="mx-2">/</div>
						</Fragment>
					);
				}

				if (idx !== array.length - 1) {
					return (
						<Fragment key={idx}>
							{el}
							<div className="mx-2">/</div>
						</Fragment>
					);
				}

				return <Fragment key={idx}>{el}</Fragment>;
			}),
		[pathElements],
	);

	return (
		<header className="dark:bg-dark-600 dark:border-dark-100 bg-light-600 border-light-800 fixed top-0 left-0 z-20 w-full border-b">
			<div className="h-18 block px-6">
				<div className="flex h-full flex-row place-content-between place-items-center">
					<Button
						aria-label="Menu"
						className="focus:ring-width-2 focus:ring-blurple flex h-6 w-6 transform-gpu cursor-pointer select-none appearance-none flex-row place-items-center rounded border-0 bg-transparent p-0 text-sm font-semibold leading-none no-underline outline-0 focus:ring active:translate-y-px lg:hidden"
						onClick={() => setOpened((open) => !open)}
					>
						<VscMenu size={24} />
					</Button>
					<div className="hidden md:flex md:flex-row md:overflow-hidden">{breadcrumbs}</div>
					<div className="flex flex-row place-items-center gap-4">
						<Button
							as="div"
							className="dark:bg-dark-800 focus:ring-width-2 focus:ring-blurple rounded bg-white px-4 py-2.5 outline-0 focus:ring"
							onClick={() => dialog?.toggle()}
						>
							<div className="flex flex-row place-items-center gap-4">
								<VscSearch size={18} />
								<span className="opacity-65">Search...</span>
								<div className="md:opacity-65 hidden md:flex md:flex-row md:place-items-center md:gap-2">
									<FiCommand size={18} /> K
								</div>
							</div>
						</Button>
						<Button
							aria-label="GitHub"
							as="a"
							className="focus:ring-width-2 focus:ring-blurple flex h-6 w-6 transform-gpu cursor-pointer select-none appearance-none flex-row place-items-center rounded rounded-full border-0 bg-transparent p-0 text-sm font-semibold leading-none no-underline outline-0 focus:ring active:translate-y-px"
							href="https://github.com/discordjs/discord.js"
							rel="noopener noreferrer"
							target="_blank"
						>
							<VscGithubInverted size={24} />
						</Button>
						{/* <Button
							aria-label="Toggle theme"
							className="focus:ring-width-2 focus:ring-blurple flex h-6 w-6 transform-gpu cursor-pointer select-none appearance-none flex-row place-items-center rounded-full rounded border-0 bg-transparent p-0 text-sm font-semibold leading-none no-underline outline-0 focus:ring active:translate-y-px"
							onClick={() => toggleTheme()}
						>
							<VscColorMode size={24} />
						</Button> */}
					</div>
				</div>
			</div>
		</header>
	);
}
