import { Button } from 'ariakit/button';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { GetStaticProps } from 'next/types';
import { useCallback, type MouseEvent } from 'react';
import { VscArrowLeft, VscArrowRight, VscPackage } from 'react-icons/vsc';
import { PACKAGES } from '~/util/constants';

interface PackageProps {
	data: {
		versions: { packageName: string; version: string }[];
	};
}

export const getStaticProps: GetStaticProps = async () => {
	try {
		const versions = await Promise.all(
			PACKAGES.map(async (pkg) => {
				const response = await fetch(`https://docs.discordjs.dev/api/info?package=${pkg}`);
				const versions = await response.json();
				const latestVersion = versions.at(-2);
				return { packageName: pkg, version: latestVersion };
			}),
		);

		return {
			props: {
				versions,
			},
			revalidate: 3_600,
		};
	} catch (error_) {
		const error = error_ as Error;
		console.error(error);

		return {
			props: {
				error: error.message,
			},
			revalidate: 1,
		};
	}
};

export default function PackagesRoute(props: Partial<PackageProps> & { error?: string }) {
	const router = useRouter();

	const findLatestVersion = useCallback(
		(pkg: string) => props.data?.versions.find((version) => version.packageName === pkg),
		[props.data?.versions],
	);

	const handleClick = async (ev: MouseEvent<HTMLDivElement>, packageName: string) => {
		ev.stopPropagation();
		void router.push(`/docs/packages/${packageName}`);
	};

	return props.error ? (
		<div className="min-w-xs sm:w-md mx-auto flex h-full flex-row place-content-center place-items-center gap-8 py-0 px-4 lg:py-0 lg:px-6">
			{props.error}
		</div>
	) : (
		<div className="min-w-xs sm:w-md mx-auto flex h-full flex-row place-content-center place-items-center gap-8 py-0 px-4 lg:py-0 lg:px-6">
			<div className="flex grow flex-col place-content-center gap-4">
				<h1 className="text-2xl font-semibold">Select a package:</h1>
				<a
					className="dark:bg-dark-400 dark:border-dark-100 dark:hover:bg-dark-300 dark:active:bg-dark-200 focus:ring-width-2 focus:ring-blurple flex h-11 transform-gpu cursor-pointer select-none appearance-none place-content-between rounded border border-neutral-300 bg-transparent p-4 text-base font-semibold leading-none text-black outline-0 hover:bg-neutral-100 focus:ring active:translate-y-px active:bg-neutral-200 dark:text-white"
					href="https://discord.js.org/#/docs/discord.js"
				>
					<div className="flex grow flex-row place-content-between place-items-center gap-4">
						<div className="flex grow flex-row place-content-between place-items-center gap-4">
							<div className="flex flex-row place-content-between place-items-center gap-4">
								<VscPackage size={25} />
								<h2 className="font-semibold">discord.js</h2>
							</div>
						</div>
						<VscArrowRight size={20} />
					</div>
				</a>
				{PACKAGES.map((pkg) => (
					<Link key={pkg} href={`/docs/packages/${pkg}/${findLatestVersion(pkg)?.version ?? 'main'}`} prefetch={false}>
						<a className="dark:bg-dark-400 dark:border-dark-100 dark:hover:bg-dark-300 dark:active:bg-dark-200 focus:ring-width-2 focus:ring-blurple flex h-11 transform-gpu cursor-pointer select-none appearance-none place-content-between rounded border border-neutral-300 bg-transparent p-4 text-base font-semibold leading-none text-black outline-0 hover:bg-neutral-100 focus:ring active:translate-y-px active:bg-neutral-200 dark:text-white">
							<div className="flex grow flex-row place-content-between place-items-center gap-4">
								<div className="flex grow flex-row place-content-between place-items-center gap-4">
									<div className="flex flex-row place-content-between place-items-center gap-4">
										<VscPackage size={25} />
										<h2 className="font-semibold">{pkg}</h2>
									</div>
									<Link href={`/docs/packages/${pkg}`} prefetch={false}>
										<Button
											as="div"
											role="link"
											className="bg-blurple focus:ring-width-2 flex h-6 transform-gpu cursor-pointer select-none appearance-none place-content-center place-items-center rounded border-0 px-2 text-xs font-semibold leading-none text-white outline-0 focus:ring focus:ring-white active:translate-y-px"
											onClick={async (ev: MouseEvent<HTMLDivElement>) => handleClick(ev, pkg)}
										>
											Select version
										</Button>
									</Link>
								</div>
								<VscArrowRight size={20} />
							</div>
						</a>
					</Link>
				))}
				<Link href="/" prefetch={false}>
					<a className="bg-blurple focus:ring-width-2 flex h-11 transform-gpu cursor-pointer select-none appearance-none place-items-center gap-2 place-self-center rounded border-0 px-4 text-base font-semibold leading-none text-white no-underline outline-0 focus:ring focus:ring-white active:translate-y-px">
						<VscArrowLeft size={20} /> Go back
					</a>
				</Link>
			</div>
		</div>
	);
}
