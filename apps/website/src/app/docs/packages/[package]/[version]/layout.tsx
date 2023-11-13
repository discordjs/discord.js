import type { ApiFunction, ApiItem } from '@discordjs/api-extractor-model';
import { ApiModel } from '@discordjs/api-extractor-model';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import { cache, type PropsWithChildren } from 'react';
import { fetchModelJSON, fetchVersions } from '~/app/docAPI';
import { CmdKDialog } from '~/components/CmdK';
import { Nav } from '~/components/Nav';
import type { SidebarSectionItemData } from '~/components/Sidebar';
import { resolveItemURI } from '~/components/documentation/util';
import { addPackageToModel } from '~/util/addPackageToModel';
import { N_RECENT_VERSIONS, PACKAGES } from '~/util/constants';
import { Providers } from './providers';

export const revalidate = 3_600;

const Header = dynamic(async () => import('~/components/Header'));
const Footer = dynamic(async () => import('~/components/Footer'));

interface VersionRouteParams {
	package: string;
	version: string;
}

export const generateStaticParams = async () => {
	const params: VersionRouteParams[] = [];

	await Promise.all(
		PACKAGES.slice(1).map(async (packageName) => {
			const versions = (await fetchVersions(packageName)).slice(0, N_RECENT_VERSIONS);

			params.push(...versions.map((version) => ({ package: packageName, version })));
		}),
	);

	return params;
};

const serializeIntoSidebarItemData = cache((item: ApiItem) => {
	return {
		kind: item.kind,
		name: item.displayName,
		href: resolveItemURI(item),
		overloadIndex: 'overloadIndex' in item ? (item.overloadIndex as number) : undefined,
	} as SidebarSectionItemData;
});

export default async function PackageLayout({ children, params }: PropsWithChildren<{ params: VersionRouteParams }>) {
	const modelJSON = await fetchModelJSON(params.package, params.version);

	if (!modelJSON) {
		notFound();
	}

	const model = addPackageToModel(new ApiModel(), modelJSON);

	const pkg = model.tryGetPackageByName(params.package);

	if (!pkg) {
		notFound();
	}

	const entry = pkg.entryPoints[0];

	if (!entry) {
		notFound();
	}

	const members = entry.members.filter((member) => {
		if (member.kind !== 'Function') {
			return true;
		}

		return (member as ApiFunction).overloadIndex === 1;
	});

	const versions = await fetchVersions(params.package);

	return (
		<Providers>
			<main className="mx-auto max-w-7xl px-4 lg:max-w-full">
				<Header />
				<div className="relative top-2.5 mx-auto max-w-7xl gap-6 lg:max-w-full lg:flex">
					<div className="lg:sticky lg:top-23 lg:h-[calc(100vh_-_105px)]">
						<Nav members={members.map((member) => serializeIntoSidebarItemData(member))} versions={versions} />
					</div>

					<div className="mx-auto max-w-5xl min-w-xs w-full pb-10">
						{children}
						<Footer />
					</div>
				</div>
			</main>
			<CmdKDialog />
		</Providers>
	);
}
