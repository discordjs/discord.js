import Image from 'next/future/image';
import Link from 'next/link';
import { FiExternalLink } from 'react-icons/fi';
import vercelLogo from '../assets/powered-by-vercel.svg';
import { SyntaxHighlighter } from '~/components/SyntaxHighlighter';
import { CODE_EXAMPLE } from '~/util/constants';

export default function IndexRoute() {
	return (
		<div className="flex flex-col place-items-center py-16 px-8 max-w-6xl mx-auto gap-12 lg:h-full lg:place-content-center lg:py-0 lg:px-6">
			<div className="flex flex-col place-items-center gap-10 lg:flex-row lg:gap-6">
				<div className="flex flex-col gap-3 max-w-lg lg:mr-8">
					<h1 className="text-3xl font-black leading-tight sm:text-5xl sm:leading-tight">
						The <span className="relative bg-blurple text-white rounded py-1 px-3">most popular</span> way to build
						Discord <br /> bots.
					</h1>
					<p className="text-gray-6 leading-normal my-6">
						discord.js is a powerful node.js module that allows you to interact with the Discord API very easily. It
						takes a much more object-oriented approach than most other JS Discord libraries, making your bot&apos;s code
						significantly tidier and easier to comprehend.
					</p>
					<div className="flex flex-row gap-4">
						<Link href="/docs" prefetch={false}>
							<a className="flex place-items-center bg-blurple appearance-none no-underline select-none cursor-pointer h-11 px-6 rounded text-white leading-none text-base font-semibold border-0 transform-gpu active:translate-y-px">
								Docs
							</a>
						</Link>
						<a
							className="flex place-items-center bg-transparent appearance-none no-underline select-none cursor-pointer h-11 px-4 rounded text-black leading-none text-base font-semibold border border-gray-3 transform-gpu hover:bg-gray-1 active:bg-gray-2 active:translate-y-px"
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
