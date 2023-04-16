import Image from 'next/image';
import vercelLogo from '~/assets/powered-by-vercel.svg';

export default function Footer() {
	return (
		<footer className="md:pl-12 md:pr-12">
			<div className="mx-auto max-w-6xl flex flex-col place-items-center gap-12 pt-12 lg:place-content-center">
				<div className="w-full flex flex-col place-content-between place-items-center gap-12 md:flex-row md:gap-0">
					<a
						className="rounded outline-none focus:ring focus:ring-width-2 focus:ring-blurple"
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
							src={vercelLogo}
							width={212}
						/>
					</a>
					<div className="flex flex-row gap-6 md:gap-12">
						<div className="flex flex-col gap-2">
							<div className="text-lg font-semibold">Community</div>
							<div className="flex flex-col gap-1">
								<a
									className="rounded outline-none focus:ring focus:ring-width-2 focus:ring-blurple"
									href="https://discord.gg/djs"
									rel="external noopener noreferrer"
									target="_blank"
								>
									Discord
								</a>
								<a
									className="rounded outline-none focus:ring focus:ring-width-2 focus:ring-blurple"
									href="https://github.com/discordjs/discord.js/discussions"
									rel="external noopener noreferrer"
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
									className="rounded outline-none focus:ring focus:ring-width-2 focus:ring-blurple"
									href="https://github.com/discordjs/discord.js"
									rel="external noopener noreferrer"
									target="_blank"
								>
									discord.js
								</a>
								<a
									className="rounded outline-none focus:ring focus:ring-width-2 focus:ring-blurple"
									href="https://discordjs.guide"
									rel="noopener noreferrer"
									target="_blank"
								>
									discord.js guide
								</a>
								<a
									className="rounded outline-none focus:ring focus:ring-width-2 focus:ring-blurple"
									href="https://discord-api-types.dev"
									rel="external noopener noreferrer"
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
