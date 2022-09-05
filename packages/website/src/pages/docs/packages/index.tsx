import { Button } from 'ariakit/button';
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
		<div className="min-w-xs sm:w-md mx-auto flex h-full flex-row place-content-center place-items-center gap-8 py-0 px-4 lg:py-0 lg:px-6">
			<div className="flex grow flex-col place-content-center gap-4">
				<h1 className="text-2xl font-semibold">Select a package:</h1>
				{PACKAGES.map((pkg) => (
					<Button
						key={pkg}
						as="div"
						className="dark:bg-dark-400 dark:border-dark-100 dark:hover:bg-dark-300 dark:active:bg-dark-200 flex h-11 transform-gpu cursor-pointer select-none appearance-none place-content-center rounded border border-neutral-300 bg-transparent p-4 text-base font-semibold leading-none text-black hover:bg-neutral-100 active:translate-y-px active:bg-neutral-200 dark:text-white"
						role="link"
						onClick={(ev: MouseEvent<HTMLDivElement>) => void handleClick(ev, pkg)}
					>
						<div className="flex flex-row place-content-between place-items-center gap-4">
							<div className="flex grow flex-row place-content-between place-items-center gap-4">
								<div className="flex flex-row place-content-between place-items-center gap-4">
									<VscPackage size={25} />
									<h2 className="font-semibold">{pkg}</h2>
								</div>
								<Link href={`/docs/packages/${pkg}`} prefetch={false}>
									<a
										className="bg-blurple flex h-6 transform-gpu cursor-pointer select-none appearance-none place-items-center rounded border-0 px-2 text-xs font-semibold leading-none text-white active:translate-y-px"
										onClick={(ev: MouseEvent<HTMLAnchorElement>) => ev.stopPropagation()}
									>
										Select version
									</a>
								</Link>
							</div>
							<VscArrowRight size={20} />
						</div>
					</Button>
				))}
			</div>
		</div>
	);
}
