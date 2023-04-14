import { FiExternalLink } from '@react-icons/all-files/fi/FiExternalLink';
import Image from 'next/image';
import Link from 'next/link';
import vercelLogo from '~/assets/powered-by-vercel.svg';
import { SyntaxHighlighter } from '~/components/SyntaxHighlighter';
import { DESCRIPTION, CODE_EXAMPLE } from '~/util/constants';

export default function Page() {
	return (
		<div className="mx-auto max-w-6xl min-h-screen flex flex-col place-items-center gap-12 px-8 py-16 lg:place-content-center lg:px-8 lg:py-0">
			<div className="flex flex-col place-items-center gap-10 lg:flex-row lg:gap-6">
				<div className="max-w-lg flex flex-col gap-3 lg:mr-8">
					<h1 className="text-3xl font-black leading-tight sm:text-5xl sm:leading-tight">
						The <span className="relative rounded bg-blurple px-3 py-1 text-white">most popular</span> way to build
						Discord <br /> bots.
					</h1>
					<p className="my-6 leading-normal text-neutral-700 dark:text-neutral-300">{DESCRIPTION}</p>
					<div className="flex flex-row gap-4">
						<Link
							className="h-11 flex flex-row transform-gpu cursor-pointer select-none appearance-none place-items-center border-0 rounded bg-blurple px-6 text-base font-semibold leading-none text-white no-underline outline-0 active:translate-y-px focus:ring focus:ring-width-2 focus:ring-white"
							href="/docs"
						>
							Docs
						</Link>
						<a
							className="h-11 flex flex-row transform-gpu cursor-pointer select-none appearance-none place-items-center gap-2 border border-light-900 rounded bg-white px-4 text-base font-semibold leading-none text-black no-underline outline-0 active:translate-y-px dark:border-dark-100 active:bg-light-300 dark:bg-dark-400 hover:bg-light-200 dark:text-white focus:ring focus:ring-width-2 focus:ring-blurple dark:active:bg-dark-200 dark:hover:bg-dark-300"
							href="https://discordjs.guide"
							rel="noopener noreferrer"
							target="_blank"
						>
							Guide <FiExternalLink />
						</a>
						<a
							className="h-11 flex flex-row transform-gpu cursor-pointer select-none appearance-none appearance-none place-items-center gap-2 border border-light-900 rounded bg-white px-4 text-base font-semibold leading-none text-black no-underline outline-0 active:translate-y-px dark:border-dark-100 active:bg-light-300 dark:bg-dark-400 hover:bg-light-200 dark:text-white focus:ring focus:ring-width-2 focus:ring-blurple dark:active:bg-dark-200 dark:hover:bg-dark-300"
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
					className="rounded outline-0 focus:ring focus:ring-width-2 focus:ring-blurple"
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
