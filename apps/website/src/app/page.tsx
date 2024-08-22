import { ExternalLink } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import vercelLogo from '~/assets/powered-by-vercel.svg';
import workersLogo from '~/assets/powered-by-workers.png';
import { InstallButton } from '~/components/ui/InstallButton';
import { DESCRIPTION } from '~/util/constants';

export default async function Page() {
	return (
		<div className="mx-auto flex min-h-screen w-full max-w-screen-lg flex-col place-content-center place-items-center gap-24 px-8 pb-16 pt-12">
			<div className="flex flex-col gap-10 text-center">
				<h1 className="z-10 text-3xl font-black leading-tight sm:text-7xl sm:leading-tight">
					The <span className="relative rounded bg-blurple px-3 py-1 text-white">most popular</span> way to build
					Discord bots.
				</h1>
				<p className="z-10 leading-normal text-neutral-700 dark:text-neutral-300 md:my-6">{DESCRIPTION}</p>

				<div className="flex flex-wrap place-content-center gap-4 sm:flex-wrap md:flex-row">
					<Link
						className="inline-flex rounded-md border border-transparent bg-blurple px-6 py-2 font-medium text-white"
						href="/docs"
					>
						Docs
					</Link>
					<a
						className="inline-flex gap-2 rounded-md border border-neutral-300 bg-white px-6 py-2 font-medium hover:bg-neutral-200 dark:border-neutral-700 dark:bg-transparent dark:hover:bg-neutral-800"
						href="https://discordjs.guide"
						rel="noopener noreferrer"
						target="_blank"
					>
						Guide <ExternalLink aria-hidden size={20} />
					</a>
					<a
						className="inline-flex gap-2 rounded-md border border-neutral-300 bg-white px-6 py-2 font-medium hover:bg-neutral-200 dark:border-neutral-700 dark:bg-transparent dark:hover:bg-neutral-800"
						href="https://github.com/discordjs/discord.js"
						rel="external noopener noreferrer"
						target="_blank"
					>
						GitHub <ExternalLink aria-hidden size={20} />
					</a>
				</div>

				<InstallButton className="place-self-center" />
			</div>

			<div className="flex flex-col gap-4 md:flex-row">
				<a
					href="https://vercel.com/?utm_source=discordjs&utm_campaign=oss"
					rel="external noopener noreferrer"
					target="_blank"
					title="Vercel"
				>
					<Image
						alt="Vercel"
						blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAABLCAQAAAA1k5H2AAAAi0lEQVR42u3SMQEAAAgDoC251a3gL2SgmfBYBRAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARCAgwWEOSWBnYbKggAAAABJRU5ErkJggg=="
						height={44}
						placeholder="blur"
						priority
						src={vercelLogo}
						width={212}
					/>
				</a>
				<a
					href="https://www.cloudflare.com"
					rel="external noopener noreferrer"
					target="_blank"
					title="Cloudflare Workers"
				>
					<Image
						alt="Cloudflare"
						blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAABLCAQAAAA1k5H2AAAAi0lEQVR42u3SMQEAAAgDoC251a3gL2SgmfBYBRAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARCAgwWEOSWBnYbKggAAAABJRU5ErkJggg=="
						height={44}
						placeholder="blur"
						priority
						src={workersLogo}
					/>
				</a>
			</div>
		</div>
	);
}
