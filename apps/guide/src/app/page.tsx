import Image from 'next/image';
import vercelLogo from '~/assets/powered-by-vercel.svg';

export default function Page() {
	return (
		<div className="mx-auto flex min-h-screen max-w-6xl flex-col place-items-center gap-12 py-16 px-8 lg:place-content-center lg:py-0 lg:px-8">
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
