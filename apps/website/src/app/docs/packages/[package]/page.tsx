import { VscArrowLeft } from '@react-icons/all-files/vsc/VscArrowLeft';
import { VscArrowRight } from '@react-icons/all-files/vsc/VscArrowRight';
import { VscVersions } from '@react-icons/all-files/vsc/VscVersions';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchVersions } from '~/app/docAPI';
import { buttonVariants } from '~/styles/Button';
import { PACKAGES } from '~/util/constants';

export const revalidate = 3_600;

export default async function Page({ params }: { params: { package: string } }) {
	if (!PACKAGES.includes(params.package)) {
		notFound();
	}

	const data = await fetchVersions(params.package);

	return (
		<div className="mx-auto min-h-screen min-w-xs flex flex-col gap-8 px-4 py-6 sm:w-md lg:px-6 lg:py-6">
			<h1 className="text-2xl font-semibold">Select a version:</h1>
			<div className="flex flex-col gap-4">
				{data.map((version, idx) => (
					<Link
						className={buttonVariants({ variant: 'secondary' })}
						href={`/docs/packages/${params.package}/${version}`}
						key={`${version}-${idx}`}
					>
						<div className="flex grow flex-row place-content-between place-items-center gap-4">
							<div className="flex flex-row place-content-between place-items-center gap-4">
								<VscVersions size={25} />
								<h2 className="font-semibold">{version}</h2>
							</div>
							<VscArrowRight size={20} />
						</div>
					</Link>
				)) ?? null}
			</div>
			<Link className={buttonVariants({ className: 'place-self-center' })} href="/docs/packages">
				<VscArrowLeft size={20} /> Go back
			</Link>
		</div>
	);
}
