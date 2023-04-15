import Image from 'next/image';
import vercelLogo from '~/assets/powered-by-vercel.svg';

export default function Page() {
	return (
		<div className="mx-auto max-w-6xl min-h-screen flex flex-col place-items-center gap-12 px-8 py-16 lg:place-content-center lg:px-8 lg:py-0">
			<div className="flex flex-row place-content-center">
				<a
					className="rounded outline-0 focus:ring focus:ring-width-2 focus:ring-blurple"
					href="https://vercel.com/?utm_source=discordjs&utm_campaign=oss"
					rel="external noopener noreferrer"
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
