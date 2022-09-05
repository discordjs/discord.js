import Image from 'next/future/image';
import Link from 'next/link';
import { FiExternalLink } from 'react-icons/fi';
import vercelLogo from '../assets/powered-by-vercel.svg';
import { SyntaxHighlighter } from '~/components/SyntaxHighlighter';
import { CODE_EXAMPLE } from '~/util/constants';

export default function IndexRoute() {
	return (
		<div className="mx-auto flex max-w-6xl flex-col place-items-center gap-12 py-16 px-8 lg:h-full lg:place-content-center lg:py-0 lg:px-6">
			<div className="flex flex-col place-items-center gap-10 lg:flex-row lg:gap-6">
				<div className="flex max-w-lg flex-col gap-3 lg:mr-8">
					<h1 className="text-3xl font-black leading-tight sm:text-5xl sm:leading-tight">
						The <span className="bg-blurple relative rounded py-1 px-3 text-white">most popular</span> way to build
						Discord <br /> bots.
					</h1>
					<p className="my-6 leading-normal text-neutral-700 dark:text-neutral-300">
						discord.js is a powerful node.js module that allows you to interact with the Discord API very easily. It
						takes a much more object-oriented approach than most other JS Discord libraries, making your bot&apos;s code
						significantly tidier and easier to comprehend.
					</p>
					<div className="flex flex-row gap-4">
						<Link href="/docs" prefetch={false}>
							<a className="bg-blurple flex h-11 transform-gpu cursor-pointer select-none appearance-none place-items-center rounded border-0 px-6 text-base font-semibold leading-none text-white no-underline active:translate-y-px">
								Docs
							</a>
						</Link>
						<a
							className="dark:bg-dark-400 dark:border-dark-100 dark:hover:bg-dark-300 dark:active:bg-dark-200 border-light-900 hover:bg-light-200 active:bg-light-300 flex h-11 transform-gpu cursor-pointer select-none appearance-none place-items-center rounded border bg-transparent px-4 text-base font-semibold leading-none text-black no-underline active:translate-y-px dark:text-white"
							href="https://discordjs.guide"
							target="_blank"
							rel="noopener noreferrer"
						>
							Guide <FiExternalLink className="ml-2" />
						</a>
					</div>
				</div>
				<SyntaxHighlighter code={CODE_EXAMPLE} />
			</div>
			<div className="flex place-content-center">
				<a
					href="https://vercel.com/?utm_source=discordjs&utm_campaign=oss"
					target="_blank"
					rel="noopener noreferrer"
					title="Vercel"
				>
					<Image src={vercelLogo} alt="Vercel" />
				</a>
			</div>
		</div>
	);
}
