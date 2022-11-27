import Link from 'next/link';
import { VscArrowLeft, VscArrowRight, VscPackage } from 'react-icons/vsc';
import { PACKAGES } from '~/util/constants';

async function getData() {
	return Promise.all(
		PACKAGES.map(async (pkg) => {
			const response = await fetch(`https://docs.discordjs.dev/api/info?package=${pkg}`, {
				next: { revalidate: 3_600 },
			});
			const versions = await response.json();
			const latestVersion = versions.at(-2) ?? 'main';
			return { packageName: pkg, version: latestVersion };
		}),
	);
}

export default async function Page() {
	const data = await getData();

	const findLatestVersion = (pkg: string) => data.find((version) => version.packageName === pkg);

	return (
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
					<Link
						className="dark:bg-dark-400 dark:border-dark-100 dark:hover:bg-dark-300 dark:active:bg-dark-200 focus:ring-width-2 focus:ring-blurple flex h-11 transform-gpu cursor-pointer select-none appearance-none flex-row place-content-between rounded border border-neutral-300 bg-transparent p-4 text-base font-semibold leading-none text-black outline-0 hover:bg-neutral-100 focus:ring active:translate-y-px active:bg-neutral-200 dark:text-white"
						href={`/docs/packages/${pkg}/${findLatestVersion(pkg)?.version ?? 'main'}`}
						key={pkg}
						prefetch={false}
					>
						<div className="flex grow flex-row place-content-between place-items-center gap-4">
							<div className="flex grow flex-row place-content-between place-items-center gap-4">
								<div className="flex flex-row place-content-between place-items-center gap-4">
									<VscPackage size={25} />
									<h2 className="font-semibold">{pkg}</h2>
								</div>
								{/* <Link href={`/docs/packages/${pkg}`} prefetch={false}>
									<div
										className="bg-blurple focus:ring-width-2 flex h-6 transform-gpu cursor-pointer select-none appearance-none flex-row place-content-center place-items-center rounded border-0 px-2 text-xs font-semibold leading-none text-white outline-0 focus:ring focus:ring-white active:translate-y-px"
										role="link"
									>
										Select version
									</div>
								</Link> */}
							</div>
							<VscArrowRight size={20} />
						</div>
					</Link>
				))}
				<Link
					className="bg-blurple focus:ring-width-2 flex h-11 transform-gpu cursor-pointer select-none appearance-none flex-row place-items-center gap-2 place-self-center rounded border-0 px-4 text-base font-semibold leading-none text-white no-underline outline-0 focus:ring focus:ring-white active:translate-y-px"
					href="/"
					prefetch={false}
				>
					<VscArrowLeft size={20} /> Go back
				</Link>
			</div>
		</div>
	);
}
