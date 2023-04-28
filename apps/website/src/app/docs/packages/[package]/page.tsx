import { VscArrowLeft } from '@react-icons/all-files/vsc/VscArrowLeft';
import { VscArrowRight } from '@react-icons/all-files/vsc/VscArrowRight';
import { VscVersions } from '@react-icons/all-files/vsc/VscVersions';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PACKAGES } from '~/util/constants';

export const runtime = 'edge';

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
		<div className="mx-auto min-h-screen min-w-xs flex flex-col gap-8 px-4 py-6 sm:w-md lg:px-6 lg:py-6">
			<h1 className="text-2xl font-semibold">Select a version:</h1>
			<div className="flex flex-col gap-4">
				{data.map((version, idx) => (
					<Link
						className="h-11 flex flex-col transform-gpu cursor-pointer select-none appearance-none place-content-center border border-neutral-300 rounded bg-white p-4 text-base font-semibold leading-none text-black outline-none active:translate-y-px dark:border-dark-100 active:bg-neutral-200 dark:bg-dark-400 hover:bg-neutral-100 dark:text-white focus:ring focus:ring-width-2 focus:ring-blurple dark:active:bg-dark-200 dark:hover:bg-dark-300"
						href={`/docs/packages/${params.package}/${version}`}
						key={`${version}-${idx}`}
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
			</div>
			<Link
				className="h-11 flex flex-row transform-gpu cursor-pointer select-none appearance-none place-items-center place-self-center gap-2 border-0 rounded bg-blurple px-4 text-base font-semibold leading-none text-white no-underline outline-none active:translate-y-px focus:ring focus:ring-width-2 focus:ring-white"
				href="/docs/packages"
			>
				<VscArrowLeft size={20} /> Go back
			</Link>
		</div>
	);
}
