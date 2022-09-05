import { Button } from 'ariakit/button';
import Link from 'next/link';
import type { GetStaticPaths, GetStaticProps } from 'next/types';
import { VscArrowRight, VscVersions } from 'react-icons/vsc';
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
	const packageName = params!.package as string | undefined;

	try {
		const res = await fetch(`https://docs.discordjs.dev/api/info?package=${packageName ?? 'builders'}`);
		const data: string[] = await res.json();

		if (!data.length) {
			console.error('No tags');

			return {
				props: {
					error: 'No tags',
				},
				revalidate: 3_600,
			};
		}

		return {
			props: {
				packageName,
				data: {
					versions: data,
				},
			},
			revalidate: 3_600,
		};
	} catch (error_) {
		const error = error_ as Error;
		console.error(error);

		return {
			props: {
				error: error_,
			},
			revalidate: 3_600,
		};
	}
};

export default function VersionsRoute(props: Partial<VersionProps> & { error?: string }) {
	return props.error ? (
		<div style={{ display: 'flex', maxWidth: '100%', height: '100%' }}>{props.error}</div>
	) : (
		<div className="min-w-xs sm:w-md mx-auto flex h-full flex-row place-content-center place-items-center gap-8 py-0 px-4 lg:py-0 lg:px-6">
			<div className="flex grow flex-col place-content-center gap-4">
				<h1 className="text-2xl font-semibold">Select a version:</h1>
				{props.data?.versions.map((version) => (
					<Link key={version} href={`/docs/packages/${props.packageName!}/${version}`} prefetch={false}>
						<Button
							as="div"
							className="dark:bg-dark-400 dark:border-dark-100 dark:hover:bg-dark-300 dark:active:bg-dark-200 flex h-11 transform-gpu cursor-pointer select-none appearance-none place-content-center rounded border border-neutral-300 bg-transparent p-4 text-base font-semibold leading-none text-black hover:bg-neutral-100 active:translate-y-px active:bg-neutral-200 dark:text-white"
						>
							<div className="flex flex-row place-content-between place-items-center gap-4">
								<div className="flex flex-row place-content-between place-items-center gap-4">
									<VscVersions size={25} />
									<h2 className="font-semibold">{version}</h2>
								</div>
								<VscArrowRight size={20} />
							</div>
						</Button>
					</Link>
				)) ?? null}
			</div>
		</div>
	);
}
