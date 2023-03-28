import Image from 'next/image';
import vercelLogo from '~/assets/powered-by-vercel.svg';

export default function Footer() {
	return (
		<footer className="dark:bg-dark-800 bg-light-600 md:pl-12 md:pr-12">
			<div className="mx-auto flex max-w-6xl flex-col place-items-center gap-12 pt-12 lg:place-content-center">
				<div className="flex w-full flex-col place-content-between place-items-center gap-12 md:flex-row md:gap-0">
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
							src={vercelLogo}
						/>
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
	);
}
