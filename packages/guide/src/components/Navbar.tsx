import { Button } from 'ariakit/button';
import { useState, useEffect } from 'react';
import { FiCommand } from 'react-icons/fi';
import { VscColorMode, VscGithubInverted, VscMenu, VscSearch } from 'react-icons/vsc';
import { useMedia } from 'react-use';
import { Sidebar } from './Sidebar.jsx';

export function Navbar({ pages }: { pages?: any }) {
	const matches = useMedia('(min-width: 992px)', false);
	const [opened, setOpened] = useState(false);

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
						<div className="hidden md:flex md:flex-row">Placeholder</div>
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
			<Sidebar opened={opened} pages={pages} />
		</>
	);
}
