import { VscArrowLeft } from '@react-icons/all-files/vsc/VscArrowLeft';
import { VscArrowRight } from '@react-icons/all-files/vsc/VscArrowRight';
import { VscVersions } from '@react-icons/all-files/vsc/VscVersions';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PACKAGES } from '~/util/constants';

export async function generateStaticParams() {
	return PACKAGES.map((packageName) => ({ package: packageName }));
}

async function getData(pkg: string) {
	if (!PACKAGES.includes(pkg)) {
		notFound();
	}

	const res = await fetch(`https://docs.discordjs.dev/api/info?package=${pkg}`, { next: { revalidate: 3_600 } });
	const data: string[] = await res.json();

	if (!data.length) {
		throw new Error('Failed to fetch data');
	}

	return data.reverse();
}

export default async function Page({ params }: { params: { package: string } }) {
	const data = await getData(params.package);

	return (
		<div className="min-w-xs sm:w-md mx-auto flex h-full flex-row place-content-center place-items-center gap-8 py-0 px-4 lg:py-0 lg:px-6">
			<div className="flex grow flex-col place-content-center gap-4">
				<h1 className="text-2xl font-semibold">Select a version:</h1>
				{data.map((version) => (
					<Link
						className="dark:bg-dark-400 dark:border-dark-100 dark:hover:bg-dark-300 dark:active:bg-dark-200 focus:ring-width-2 focus:ring-blurple flex h-11 transform-gpu cursor-pointer select-none appearance-none flex-col place-content-center rounded border border-neutral-300 bg-transparent p-4 text-base font-semibold leading-none text-black outline-0 hover:bg-neutral-100 focus:ring active:translate-y-px active:bg-neutral-200 dark:text-white"
						href={`/docs/packages/${params.package}/${version}`}
						key={version}
					>
						<div className="flex flex-row place-content-between place-items-center gap-4">
							<div className="flex flex-row place-content-between place-items-center gap-4">
								<VscVersions size={25} />
								<h2 className="font-semibold">{version}</h2>
							</div>
							<VscArrowRight size={20} />
						</div>
					</Link>
				)) ?? null}
				<Link
					className="bg-blurple focus:ring-width-2 flex h-11 transform-gpu cursor-pointer select-none appearance-none flex-row place-items-center gap-2 place-self-center rounded border-0 px-4 text-base font-semibold leading-none text-white no-underline outline-0 focus:ring focus:ring-white active:translate-y-px"
					href="/docs/packages"
				>
					<VscArrowLeft size={20} /> Go back
				</Link>
			</div>
		</div>
	);
}
