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
		<div className="flex flex-row place-items-center py-0 px-4 max-w-lg w-lg mx-auto gap-8 h-full place-content-center lg:py-0 lg:px-6">
			<div className="flex flex-col place-content-center grow gap-4">
				<h1 className="text-2xl font-semibold">Select a version:</h1>
				{props.data?.versions.map((version) => (
					<Link key={version} href={`/docs/packages/${props.packageName!}/${version}`} prefetch={false}>
						<div className="flex place-content-center bg-transparent appearance-none h-11 p-4 rounded select-none cursor-pointer dark:bg-dark-4 text-black dark:text-white leading-none text-base font-semibold border border-neutral-3 dark:border-dark-1 transform-gpu hover:bg-neutral-1 dark:hover:bg-dark-3 active:bg-neutral-2 dark:active:bg-dark-2 active:translate-y-px">
							<div className="flex flex-row place-content-between place-items-center gap-4">
								<div className="flex flex-row place-content-between place-items-center gap-4">
									<VscVersions size={25} />
									<h2 className="font-semibold">{version}</h2>
								</div>
								<VscArrowRight size={20} />
							</div>
						</div>
					</Link>
				)) ?? null}
			</div>
		</div>
	);
}
