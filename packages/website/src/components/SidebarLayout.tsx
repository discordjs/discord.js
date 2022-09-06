import type { getMembers, ApiItemJSON } from '@discordjs/api-extractor-utils';
import { Button } from 'ariakit/button';
import { Menu, MenuButton, MenuItem, useMenuState } from 'ariakit/menu';
import Image from 'next/future/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { useTheme } from 'next-themes';
import { type PropsWithChildren, useState, useEffect, useMemo, Fragment } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { VscChevronDown, VscColorMode, VscGithubInverted, VscMenu, VscPackage, VscVersions } from 'react-icons/vsc';
import { useMedia /* useLockBodyScroll */ } from 'react-use';
import useSWR from 'swr';
import vercelLogo from '../assets/powered-by-vercel.svg';
import { SidebarItems } from './SidebarItems';
import { PACKAGES } from '~/util/constants';
import type { findMember } from '~/util/model.server';

const fetcher = async (url: string) => {
	const res = await fetch(url);
	return res.json();
};

export interface SidebarLayoutProps {
	branchName: string;
	data: {
		member: ReturnType<typeof findMember>;
		members: ReturnType<typeof getMembers>;
		searchIndex: any[];
		source: MDXRemoteSerializeResult;
	};
	packageName: string;

	selectedMember?: ApiItemJSON | undefined;
}

export type Members = SidebarLayoutProps['data']['members'];

export interface GroupedMembers {
	Classes: Members;
	Enums: Members;
	Functions: Members;
	Interfaces: Members;
	Types: Members;
	Variables: Members;
}

export function SidebarLayout({
	packageName,
	branchName,
	data,
	children,
}: PropsWithChildren<Partial<SidebarLayoutProps>>) {
	const router = useRouter();
	const [asPathWithoutQueryAndAnchor, setAsPathWithoutQueryAndAnchor] = useState('');
	const { data: versions } = useSWR<string[]>(`https://docs.discordjs.dev/api/info?package=${packageName}`, fetcher);
	const { resolvedTheme, setTheme } = useTheme();
	const toggleTheme = () => setTheme(resolvedTheme === 'light' ? 'dark' : 'light');
	const matches = useMedia('(min-width: 992px)', false);
	const [opened, setOpened] = useState(false);
	const packageMenu = useMenuState({ gutter: 8, sameWidth: true });
	const versionMenu = useMenuState({ gutter: 8, sameWidth: true });
	// useLockBodyScroll(opened);

	useEffect(() => {
		if (matches) {
			setOpened(false);
		}
	}, [matches]);

	useEffect(() => {
		setAsPathWithoutQueryAndAnchor(router.asPath.split('?')[0]?.split('#')[0]?.split(':')[0] ?? '');
	}, [router.asPath]);

	const packageMenuItems = PACKAGES.map((pkg) => (
		<Link key={pkg} href={`/docs/packages/${pkg}/main`} passHref prefetch={false}>
			<MenuItem
				className="hover:bg-light-700 active:bg-light-800 dark:bg-dark-600 dark:hover:bg-dark-500 dark:active:bg-dark-400 rounded bg-white p-3 text-sm"
				as="a"
				state={packageMenu}
			>
				{pkg}
			</MenuItem>
		</Link>
	));

	const versionMenuItems = useMemo(
		() =>
			versions
				?.map((item) => (
					<Link key={item} href={`/docs/packages/${packageName}/${item}`} passHref prefetch={false}>
						<MenuItem
							className="hover:bg-light-700 active:bg-light-800 dark:bg-dark-600 dark:hover:bg-dark-500 dark:active:bg-dark-400 rounded bg-white p-3 text-sm"
							as="a"
							state={versionMenu}
						>
							{item}
						</MenuItem>
					</Link>
				))
				.reverse() ?? [],
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[versions, packageName],
	);

	const pathElements = useMemo(
		() =>
			asPathWithoutQueryAndAnchor.split('/').map((path, idx, original) => (
				<Link key={idx} href={original.slice(0, idx + 1).join('/')} prefetch={false}>
					<a className="hover:underline">{path}</a>
				</Link>
			)),
		[asPathWithoutQueryAndAnchor],
	);

	const breadcrumbs = useMemo(
		() =>
			pathElements.flatMap((el, idx, array) => {
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
		<>
			<header className="dark:bg-dark-600 dark:border-dark-100 bg-light-600 border-light-800 fixed top-0 left-0 z-20 w-full border-b">
				<div className="h-18 block px-6">
					<div className="flex h-full flex-row place-content-between place-items-center">
						<Button
							className="flex h-6 w-6 transform-gpu cursor-pointer select-none appearance-none place-items-center rounded border-0 bg-transparent p-0 text-sm font-semibold leading-none no-underline active:translate-y-px lg:hidden"
							onClick={() => setOpened((open) => !open)}
						>
							<VscMenu size={24} />
						</Button>
						<div className="hidden md:flex md:flex-row">{breadcrumbs}</div>
						<div className="flex flex-row gap-4">
							<Button
								as="a"
								className="flex h-6 w-6 transform-gpu cursor-pointer select-none appearance-none place-items-center rounded border-0 bg-transparent p-0 text-sm font-semibold leading-none no-underline active:translate-y-px"
								href="https://github.com/discordjs/discord.js"
								target="_blank"
								rel="noopener noreferrer"
							>
								<VscGithubInverted size={24} />
							</Button>
							<Button
								className="flex h-6 w-6 transform-gpu cursor-pointer select-none appearance-none place-items-center rounded border-0 bg-transparent p-0 text-sm font-semibold leading-none no-underline active:translate-y-px"
								role="button"
								onClick={() => toggleTheme()}
							>
								<VscColorMode size={24} />
							</Button>
						</div>
					</div>
				</div>
			</header>
			<nav
				className={`h-[calc(100vh - 73px)] dark:bg-dark-600 dark:border-dark-100 border-light-800 fixed top-[73px] left-0 bottom-0 z-20 w-full border-r bg-white ${
					opened ? 'block' : 'hidden'
				} lg:w-76 lg:max-w-76 lg:block`}
			>
				<Scrollbars
					universal
					autoHide
					hideTracksWhenNotNeeded
					renderTrackVertical={(props) => (
						<div {...props} className="absolute top-0.5 right-0.5 bottom-0.5 z-30 w-1.5 rounded" />
					)}
					renderThumbVertical={(props) => <div {...props} className="dark:bg-dark-100 bg-light-900 z-30 rounded" />}
				>
					<div className="flex flex-col gap-3 px-3 pt-3">
						<MenuButton
							className="bg-light-600 hover:bg-light-700 active:bg-light-800 dark:bg-dark-600 dark:hover:bg-dark-500 dark:active:bg-dark-400 rounded p-3"
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
							className="dark:bg-dark-600 border-light-800 dark:border-dark-100 z-20 rounded border bg-white p-1"
							state={packageMenu}
						>
							{packageMenuItems}
						</Menu>

						<MenuButton
							className="bg-light-600 hover:bg-light-700 active:bg-light-800 dark:bg-dark-600 dark:hover:bg-dark-500 dark:active:bg-dark-400 rounded p-3"
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
							className="dark:bg-dark-600 border-light-800 dark:border-dark-100 z-20 rounded border bg-white p-1"
							state={versionMenu}
						>
							{versionMenuItems}
						</Menu>
					</div>

					<SidebarItems members={data?.members ?? []} setOpened={setOpened} />
				</Scrollbars>
			</nav>
			<main
				className={`pt-18 lg:pl-76 ${
					data?.member?.kind === 'Class' || data?.member?.kind === 'Interface' ? 'xl:pr-64' : ''
				}`}
			>
				<article className="dark:bg-dark-600 bg-light-600">
					<div className="min-h-[calc(100vh - 50px)] dark:bg-dark-800 relative z-10 bg-white p-6 pb-20 shadow">
						{children}
					</div>
					<div className="h-76 md:h-52" />
					<footer
						className={`dark:bg-dark-600 h-76 lg:pl-84 bg-light-600 fixed bottom-0 left-0 right-0 md:h-52 md:pl-4 md:pr-16 ${
							data?.member?.kind === 'Class' || data?.member?.kind === 'Interface' ? 'xl:pr-76' : 'xl:pr-16'
						}`}
					>
						<div className="mx-auto flex max-w-6xl flex-col place-items-center gap-12 pt-12 lg:place-content-center">
							<div className="flex w-full flex-col place-content-between place-items-center gap-12 md:flex-row md:gap-0">
								<a
									href="https://vercel.com/?utm_source=discordjs&utm_campaign=oss"
									target="_blank"
									rel="noopener noreferrer"
									title="Vercel"
								>
									<Image src={vercelLogo} alt="Vercel" />
								</a>
								<div className="flex flex-row gap-6 md:gap-12">
									<div className="flex flex-col gap-2">
										<h4 className="text-lg font-semibold">Community</h4>
										<div className="flex flex-col gap-1">
											<a href="https://discord.gg/djs" target="_blank" rel="noopener noreferrer">
												Discord
											</a>
											<a
												href="https://github.com/discordjs/discord.js/discussions"
												target="_blank"
												rel="noopener noreferrer"
											>
												GitHub discussions
											</a>
										</div>
									</div>
									<div className="flex flex-col gap-2">
										<h4 className="text-lg font-semibold">Project</h4>
										<div className="flex flex-col gap-1">
											<a href="https://github.com/discordjs/discord.js" target="_blank" rel="noopener noreferrer">
												discord.js
											</a>
											<a href="https://discordjs.guide" target="_blank" rel="noopener noreferrer">
												discord.js guide
											</a>
											<a href="https://discord-api-types.dev" target="_blank" rel="noopener noreferrer">
												discord-api-types
											</a>
										</div>
									</div>
								</div>
							</div>
						</div>
					</footer>
				</article>
			</main>
		</>
	);
}
