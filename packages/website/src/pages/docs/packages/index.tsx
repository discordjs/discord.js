import Link from 'next/link';
import { useRouter } from 'next/router';
import type { MouseEvent } from 'react';
import { VscArrowRight, VscPackage } from 'react-icons/vsc';
import { PACKAGES } from '~/util/constants';

export default function PackagesRoute() {
	const router = useRouter();

	const handleClick = async (ev: MouseEvent<HTMLDivElement>, packageName: string) => {
		ev.stopPropagation();

		const res = await fetch(`https://docs.discordjs.dev/api/info?package=${packageName ?? 'builders'}`);
		const data: string[] = await res.json();

		const latestVersion = data.at(-2);
		void router.push(`/docs/packages/${packageName}/${latestVersion}`);
	};

	return (
		<div className="flex flex-row place-items-center py-0 px-4 max-w-lg w-lg mx-auto gap-8 h-full place-content-center lg:py-0 lg:px-6">
			<div className="flex flex-col place-content-center grow gap-4">
				<h1 className="text-2xl font-semibold">Select a package:</h1>
				{PACKAGES.map((pkg) => (
					<div
						key={pkg}
						className="flex place-content-center bg-transparent appearance-none h-11 p-4 rounded text-black leading-none text-base font-semibold border border-gray-3 transform-gpu hover:bg-gray-1 active:bg-gray-2 active:translate-y-px"
						role="link"
						onClick={(ev: MouseEvent<HTMLDivElement>) => void handleClick(ev, pkg)}
					>
						<div className="flex flex-row place-content-between place-items-center gap-4">
							<div className="flex flex-row place-content-between place-items-center grow gap-4">
								<div className="flex flex-row place-content-between place-items-center gap-4">
									<VscPackage size={25} />
									<h2 className="font-semibold">{pkg}</h2>
								</div>
								<Link href={`/docs/packages/${pkg}`} prefetch={false}>
									<a
										className="flex place-items-center bg-blurple appearance-none no-underline select-none cursor-pointer h-6 px-2 rounded text-white leading-none text-xs font-semibold border-0 transform-gpu active:translate-y-px"
										onClick={(ev: MouseEvent<HTMLAnchorElement>) => ev.stopPropagation()}
									>
										Select version
									</a>
								</Link>
							</div>
							<VscArrowRight size={20} />
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
