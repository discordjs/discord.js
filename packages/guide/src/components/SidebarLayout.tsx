import { Button } from 'ariakit/button';
// import { Menu, MenuButton, MenuItem, useMenuState } from 'ariakit/menu';
import { type PropsWithChildren, useState, useEffect /* useMemo, Fragment */ } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { FiCommand } from 'react-icons/fi';
import {
	// VscChevronDown,
	VscColorMode,
	VscGithubInverted,
	VscMenu,
	VscSearch,
	// VscVersions,
} from 'react-icons/vsc';
import { useMedia /* useLockBodyScroll */ } from 'react-use';
// import vercelLogo from '../assets/powered-by-vercel.svg';
// import { CmdKDialog } from './CmdK';
// import { SidebarItems } from './SidebarItems';
// import { useCmdK } from '~/contexts/cmdK';

export function SidebarLayout({ pages, children }: PropsWithChildren<{ pages?: any }>) {
	// const dialog = useCmdK();
	const matches = useMedia('(min-width: 992px)', false);
	const [opened, setOpened] = useState(false);
	// useLockBodyScroll(opened);

	useEffect(() => {
		if (matches) {
			setOpened(false);
		}
	}, [matches]);

	return (
		<>
			<header className="dark:bg-dark-600 dark:border-dark-100 bg-light-600 border-light-800 fixed top-0 left-0 z-20 w-full border-b">
				<div className="h-18 block px-6">
					<div className="flex h-full flex-row place-content-between place-items-center">
						<Button
							aria-label="Menu"
							className="focus:ring-width-2 focus:ring-blurple flex h-6 w-6 transform-gpu cursor-pointer select-none appearance-none place-items-center rounded border-0 bg-transparent p-0 text-sm font-semibold leading-none no-underline outline-0 focus:ring active:translate-y-px lg:hidden"
							onClick={() => setOpened((open) => !open)}
						>
							<VscMenu size={24} />
						</Button>
						{/* <div className="hidden md:flex md:flex-row">{breadcrumbs}</div> */}
						<div className="flex flex-row place-items-center gap-4">
							<Button
								as="div"
								className="dark:bg-dark-800 focus:ring-width-2 focus:ring-blurple rounded bg-white px-4 py-2.5 outline-0 focus:ring"
								// onClick={() => dialog?.toggle()}
							>
								<div className="flex flex-row place-items-center gap-4">
									<VscSearch size={18} />
									<span className="opacity-65">Search...</span>
									<div className="opacity-65 flex flex-row place-items-center gap-2">
										<FiCommand size={18} /> K
									</div>
								</div>
							</Button>
							<Button
								aria-label="GitHub"
								as="a"
								className="focus:ring-width-2 focus:ring-blurple flex h-6 w-6 transform-gpu cursor-pointer select-none appearance-none place-items-center rounded rounded-full border-0 bg-transparent p-0 text-sm font-semibold leading-none no-underline outline-0 focus:ring active:translate-y-px"
								href="https://github.com/discordjs/discord.js"
								rel="noopener noreferrer"
								target="_blank"
							>
								<VscGithubInverted size={24} />
							</Button>
							<Button
								aria-label="Toggle theme"
								className="focus:ring-width-2 focus:ring-blurple flex h-6 w-6 transform-gpu cursor-pointer select-none appearance-none place-items-center rounded-full rounded border-0 bg-transparent p-0 text-sm font-semibold leading-none no-underline outline-0 focus:ring active:translate-y-px"
								// onClick={() => toggleTheme()}
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
					autoHide
					hideTracksWhenNotNeeded
					renderThumbVertical={(props) => <div {...props} className="dark:bg-dark-100 bg-light-900 z-30 rounded" />}
					renderTrackVertical={(props) => (
						<div {...props} className="absolute top-0.5 right-0.5 bottom-0.5 z-30 w-1.5 rounded" />
					)}
					universal
				>
					{pages ?? null}
				</Scrollbars>
			</nav>
			<main className="pt-18 lg:pl-76 xl:pr-64">
				<article className="dark:bg-dark-600 bg-light-600">
					<div className="dark:bg-dark-800 relative z-10 min-h-[calc(100vh_-_70px)] bg-white p-6 pb-20 shadow">
						<div className="prose max-w-none">{children}</div>
					</div>
					<div className="h-76 md:h-52" />
					<footer className="dark:bg-dark-600 h-76 lg:pl-84 bg-light-600 xl:pr-76 fixed bottom-0 left-0 right-0 md:h-52 md:pl-4 md:pr-16">
						<div className="mx-auto flex max-w-6xl flex-col place-items-center gap-12 pt-12 lg:place-content-center">
							<div className="flex w-full flex-col place-content-between place-items-center gap-12 md:flex-row md:gap-0">
								<a
									className="focus:ring-width-2 focus:ring-blurple rounded outline-0 focus:ring"
									href="https://vercel.com/?utm_source=discordjs&utm_campaign=oss"
									rel="noopener noreferrer"
									target="_blank"
									title="Vercel"
								>
									{/* <Image alt="Vercel" src={vercelLogo} /> */}
								</a>
								<div className="flex flex-row gap-6 md:gap-12">
									<div className="flex flex-col gap-2">
										<div className="text-lg font-semibold">Community</div>
										<div className="flex flex-col gap-1">
											<a
												className="focus:ring-width-2 focus:ring-blurple rounded outline-0 focus:ring"
												href="https://discord.gg/djs"
												rel="noopener noreferrer"
												target="_blank"
											>
												Discord
											</a>
											<a
												className="focus:ring-width-2 focus:ring-blurple rounded outline-0 focus:ring"
												href="https://github.com/discordjs/discord.js/discussions"
												rel="noopener noreferrer"
												target="_blank"
											>
												GitHub discussions
											</a>
										</div>
									</div>
									<div className="flex flex-col gap-2">
										<div className="text-lg font-semibold">Project</div>
										<div className="flex flex-col gap-1">
											<a
												className="focus:ring-width-2 focus:ring-blurple rounded outline-0 focus:ring"
												href="https://github.com/discordjs/discord.js"
												rel="noopener noreferrer"
												target="_blank"
											>
												discord.js
											</a>
											<a
												className="focus:ring-width-2 focus:ring-blurple rounded outline-0 focus:ring"
												href="https://discordjs.guide"
												rel="noopener noreferrer"
												target="_blank"
											>
												discord.js guide
											</a>
											<a
												className="focus:ring-width-2 focus:ring-blurple rounded outline-0 focus:ring"
												href="https://discord-api-types.dev"
												rel="noopener noreferrer"
												target="_blank"
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
			{/* <CmdKDialog /> */}
		</>
	);
}
