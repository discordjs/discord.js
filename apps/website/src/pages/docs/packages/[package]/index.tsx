import Link from 'next/link';
import type { GetStaticPaths, GetStaticProps } from 'next/types';
import { VscArrowLeft, VscArrowRight, VscVersions } from 'react-icons/vsc';
import { PACKAGES } from '~/util/constants';

interface VersionProps {
	data: {
		versions: string[];
	};
	packageName: string;
}

export const getStaticPaths: GetStaticPaths = () => {
	const versions = PACKAGES.map((packageName) => ({ params: { package: packageName } }));

	return {
		paths: versions,
		fallback: false,
	};
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const packageName = params!.package as string;

	if (!PACKAGES.includes(packageName)) {
		return {
			notFound: true,
		};
	}

	try {
		const res = await fetch(`https://docs.discordjs.dev/api/info?package=${packageName}`);
		const data: string[] = await res.json();

		if (!data.length) {
			return {
				notFound: true,
			};
		}

		return {
			props: {
				packageName,
				data: {
					versions: data.reverse(),
				},
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

export default function VersionsRoute(props: Partial<VersionProps> & { error?: string }) {
	return props.error ? (
		<div className="min-w-xs sm:w-md mx-auto flex h-full flex-row place-content-center place-items-center gap-8 py-0 px-4 lg:py-0 lg:px-6">
			{props.error}
		</div>
	) : (
		<div className="min-w-xs sm:w-md mx-auto flex h-full flex-row place-content-center place-items-center gap-8 py-0 px-4 lg:py-0 lg:px-6">
			<div className="flex grow flex-col place-content-center gap-4">
				<h1 className="text-2xl font-semibold">Select a version:</h1>
				{props.data?.versions.map((version) => (
					<Link href={`/docs/packages/${props.packageName}/${version}`} key={version} prefetch={false}>
						<a className="dark:bg-dark-400 dark:border-dark-100 dark:hover:bg-dark-300 dark:active:bg-dark-200 focus:ring-width-2 focus:ring-blurple flex h-11 transform-gpu cursor-pointer select-none appearance-none flex-col place-content-center rounded border border-neutral-300 bg-transparent p-4 text-base font-semibold leading-none text-black outline-0 hover:bg-neutral-100 focus:ring active:translate-y-px active:bg-neutral-200 dark:text-white">
							<div className="flex flex-row place-content-between place-items-center gap-4">
								<div className="flex flex-row place-content-between place-items-center gap-4">
									<VscVersions size={25} />
									<h2 className="font-semibold">{version}</h2>
								</div>
								<VscArrowRight size={20} />
							</div>
						</a>
					</Link>
				)) ?? null}
				<Link href="/docs/packages" prefetch={false}>
					<a className="bg-blurple focus:ring-width-2 flex h-11 transform-gpu cursor-pointer select-none appearance-none flex-row place-items-center gap-2 place-self-center rounded border-0 px-4 text-base font-semibold leading-none text-white no-underline outline-0 focus:ring focus:ring-white active:translate-y-px">
						<VscArrowLeft size={20} /> Go back
					</a>
				</Link>
			</div>
		</div>
	);
}
