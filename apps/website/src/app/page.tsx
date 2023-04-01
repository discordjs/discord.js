import { FiExternalLink } from '@react-icons/all-files/fi/FiExternalLink';
import Image from 'next/image';
import Link from 'next/link';
import vercelLogo from '~/assets/powered-by-vercel.svg';
import { SyntaxHighlighter } from '~/components/SyntaxHighlighter';
import { CODE_EXAMPLE } from '~/util/constants';

export default function Page() {
	return (
		<div className="mx-auto flex min-h-screen max-w-6xl flex-col place-items-center gap-12 px-8 py-16 lg:place-content-center lg:px-8 lg:py-0">
			<div className="flex flex-col place-items-center gap-10 lg:flex-row lg:gap-6">
				<div className="flex max-w-lg flex-col gap-3 lg:mr-8">
					<h1 className="text-3xl font-black leading-tight sm:text-5xl sm:leading-tight">
						The <span className="bg-blurple relative rounded px-3 py-1 text-white">most popular</span> way to build
						Discord <br /> bots.
					</h1>
					<p className="my-6 leading-normal text-neutral-700 dark:text-neutral-300">
						discord.js is a powerful node.js module that allows you to interact with the Discord API very easily. It
						takes a much more object-oriented approach than most other JS Discord libraries, making your bot&apos;s code
						significantly tidier and easier to comprehend.
					</p>
					<div className="flex flex-row gap-4">
						<Link
							className="bg-blurple focus:ring-width-2 flex h-11 transform-gpu cursor-pointer select-none appearance-none flex-row place-items-center rounded border-0 px-6 text-base font-semibold leading-none text-white no-underline outline-0 focus:ring focus:ring-white active:translate-y-px"
							href="/docs"
						>
							Docs
						</Link>
						<a
							className="dark:bg-dark-400 dark:border-dark-100 dark:hover:bg-dark-300 dark:active:bg-dark-200 border-light-900 hover:bg-light-200 active:bg-light-300 focus:ring-blurple focus:ring-width-2 flex h-11 transform-gpu cursor-pointer select-none appearance-none flex-row place-items-center gap-2 rounded border bg-white px-4 text-base font-semibold leading-none text-black no-underline outline-0 focus:ring active:translate-y-px dark:text-white"
							href="https://discordjs.guide"
							rel="noopener noreferrer"
							target="_blank"
						>
							Guide <FiExternalLink />
						</a>
						<a
							className="dark:bg-dark-400 dark:border-dark-100 dark:hover:bg-dark-300 dark:active:bg-dark-200 border-light-900 hover:bg-light-200 active:bg-light-300 focus:ring-blurple focus:ring-width-2 flex h-11 transform-gpu cursor-pointer select-none appearance-none appearance-none flex-row place-items-center gap-2 rounded border bg-white px-4 text-base font-semibold leading-none text-black no-underline outline-0 focus:ring active:translate-y-px dark:text-white"
							href="https://github.com/discordjs/discord.js"
							rel="noopener noreferrer"
							target="_blank"
						>
							GitHub <FiExternalLink />
						</a>
					</div>
				</div>
				<div className="max-w-xs sm:max-w-6xl">
					{/* @ts-expect-error async component */}
					<SyntaxHighlighter code={CODE_EXAMPLE} />
				</div>
			</div>
			<div className="flex flex-row place-content-center">
				<a
					className="focus:ring-width-2 focus:ring-blurple rounded outline-0 focus:ring"
					href="https://vercel.com/?utm_source=discordjs&utm_campaign=oss"
					rel="noopener noreferrer"
					target="_blank"
					title="Vercel"
				>
					<Image
						alt="Vercel"
						blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAABLCAQAAAA1k5H2AAAAi0lEQVR42u3SMQEAAAgDoC251a3gL2SgmfBYBRAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARCAgwWEOSWBnYbKggAAAABJRU5ErkJggg=="
						placeholder="blur"
						priority
						src={vercelLogo}
					/>
				</a>
			</div>
		</div>
	);
}
