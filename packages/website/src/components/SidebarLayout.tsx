import type { getMembers, ApiItemJSON } from '@discordjs/api-extractor-utils';
import { useScrollLock, useMediaQuery } from '@mantine/hooks';
import Image from 'next/future/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { useTheme } from 'next-themes';
import { type PropsWithChildren, useState, useEffect, useMemo, Fragment } from 'react';
import { VscColorMode, VscGithubInverted, VscMenu } from 'react-icons/vsc';
// import useSWR from 'swr';
import vercelLogo from '../assets/powered-by-vercel.svg';
import { SidebarItems } from './SidebarItems';
// import { PACKAGES } from '~/util/constants';
import type { findMember } from '~/util/model.server';

// const fetcher = async (url: string) => {
// 	const res = await fetch(url);
// 	return res.json();
// };

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

// const packageMenuItems = PACKAGES.map((pkg) => (
// 	<Menu.Item
// 		key={pkg}
// 		component={NextLink}
// 		href={`/docs/packages/${pkg}/main`}
// 		sx={(theme) => ({ color: theme.colorScheme === 'dark' ? theme.white : theme.black })}
// 	>
// 		{pkg}
// 	</Menu.Item>
// ));

export function SidebarLayout({ data, children }: PropsWithChildren<Partial<SidebarLayoutProps>>) {
	const router = useRouter();
	const [asPathWithoutQueryAndAnchor, setAsPathWithoutQueryAndAnchor] = useState('');
	// const { data: versions } = useSWR<string[]>(
	// 	`https://docs.discordjs.dev/api/info?package=${packageName ?? 'builders'}`,
	// 	fetcher,
	// );
	const { resolvedTheme, setTheme } = useTheme();
	const toggleTheme = () => setTheme(resolvedTheme === 'light' ? 'dark' : 'light');
	const [, setScrollLocked] = useScrollLock();
	const matches = useMediaQuery('(min-width: 992px)', true, { getInitialValueInEffect: false });
	const [opened, setOpened] = useState(false);
	// const [openedLibPicker, setOpenedLibPicker] = useState(false);
	// const [openedVersionPicker, setOpenedVersionPicker] = useState(false);

	useEffect(() => {
		if (matches) {
			setOpened(false);
		}

		return () => setOpened(false);
	}, [matches]);

	useEffect(() => {
		if (opened) {
			setScrollLocked(true);
		} else {
			setScrollLocked(false);
		}

		return () => setScrollLocked(false);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [opened]);

	useEffect(() => {
		setOpened(false);
		// setOpenedLibPicker(false);
		// setOpenedVersionPicker(false);

		return () => setOpened(false);
	}, []);

	useEffect(() => {
		setAsPathWithoutQueryAndAnchor(router.asPath.split('?')[0]?.split('#')[0]?.split(':')[0] ?? '');
	}, [router.asPath]);

	// const versionMenuItems = useMemo(
	// 	() =>
	// 		versions?.map((item) => (
	// 			<Menu.Item
	// 				key={item}
	// 				component={NextLink}
	// 				href={`/docs/packages/${packageName ?? 'builders'}/${item}`}
	// 				sx={(theme) => ({ color: theme.colorScheme === 'dark' ? theme.white : theme.black })}
	// 			>
	// 				{item}
	// 			</Menu.Item>
	// 		)) ?? [],
	// 	[versions, packageName],
	// );

	const pathElements = useMemo(
		() =>
			asPathWithoutQueryAndAnchor.split('/').map((path, idx, original) => (
				<Link key={idx} href={original.slice(0, idx + 1).join('/')} prefetch={false}>
					<a className="text-black no-underline hover:underline">{path}</a>
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
			<header className="fixed top-0 left-0 w-full z-2 bg-gray-1 border-b-1 border-gray-2">
				<div className="block h-18 px-6">
					<div className="flex flex-row h-full place-items-center place-content-between">
						<div
							className="flex place-items-center bg-transparent appearance-none no-underline select-none cursor-pointer h-6 w-6 p-0 rounded text-black leading-none text-sm font-semibold border-0 transform-gpu active:translate-y-px lg:hidden"
							role="button"
							onClick={() => setOpened((open) => !open)}
						>
							<VscMenu size={24} />
						</div>
						<div className="hidden md:flex md:flex-row">{breadcrumbs}</div>
						<div className="flex flex-row gap-4">
							<a
								className="flex place-items-center bg-transparent appearance-none no-underline select-none cursor-pointer h-6 w-6 p-0 rounded text-black leading-none text-sm font-semibold border-0 transform-gpu active:translate-y-px"
								href="https://github.com/discordjs/discord.js"
								target="_blank"
								rel="noopener noreferrer"
							>
								<VscGithubInverted size={24} />
							</a>
							<div
								className="flex place-items-center bg-transparent appearance-none no-underline select-none cursor-pointer h-6 w-6 p-0 rounded text-black leading-none text-sm font-semibold border-0 transform-gpu active:translate-y-px"
								role="button"
								onClick={() => toggleTheme()}
							>
								<VscColorMode size={24} />
							</div>
						</div>
					</div>
				</div>
			</header>
			<nav
				className={`fixed top-[73px] left-0 bottom-0 w-full bg-white z-1 h-[calc(100vh - 73px)] border-r-1 border-gray-2 overflow-y-auto ${
					opened ? 'block' : 'hidden'
				} z-2 lg:block lg:w-76 lg:max-w-76`}
			>
				<SidebarItems members={data?.members ?? []} setOpened={setOpened} />
			</nav>
			<main
				className={`pt-18 lg:pl-76 ${
					data?.member?.kind === 'Class' || data?.member?.kind === 'Interface' ? 'lg:pr-64' : 'lg:pr-0'
				}`}
			>
				<article>
					<div className="relative min-h-[calc(100vh - 50px)] p-6 pb-20 z-1 bg-white shadow">{children}</div>
					<div className="h-76 md:h-52" />
					<footer
						className={`fixed bottom-0 left-0 right-0 bg-gray-1 h-76 md:h-52 md:pl-4 md:pr-16 lg:pl-84 ${
							data?.member?.kind === 'Class' || data?.member?.kind === 'Interface' ? 'xl:pr-76' : 'xl:pr-16'
						}`}
					>
						<div className="flex flex-col place-items-center max-w-6xl mx-auto gap-12 pt-12 lg:place-content-center">
							<div className="flex flex-col gap-12 place-items-center place-content-between w-full md:flex-row md:gap-0">
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
											<a
												className="text-black no-underline"
												href="https://discord.gg/djs"
												target="_blank"
												rel="noopener noreferrer"
											>
												Discord
											</a>
											<a
												className="text-black no-underline"
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
											<a
												className="text-black no-underline"
												href="https://github.com/discordjs/discord.js"
												target="_blank"
												rel="noopener noreferrer"
											>
												discord.js
											</a>
											<a
												className="text-black no-underline"
												href="https://discordjs.guide"
												target="_blank"
												rel="noopener noreferrer"
											>
												discord.js guide
											</a>
											<a
												className="text-black no-underline"
												href="https://discord-api-types.dev"
												target="_blank"
												rel="noopener noreferrer"
											>
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
