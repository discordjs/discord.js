import { createApiModel } from '@discordjs/scripts';
import type { ApiItem } from '@microsoft/api-extractor-model';
import { notFound } from 'next/navigation';
import type { PropsWithChildren } from 'react';
import { fetchModelJSON, fetchVersions } from '~/app/docAPI';
import { Header } from '~/components/Header';
import { Nav } from '~/components/Nav';
import type { SidebarSectionItemData } from '~/components/Sidebar';
import { resolveURI } from '~/components/documentation/util';
import { N_RECENT_VERSIONS, PACKAGES } from '~/util/constants';

export interface VersionRouteParams {
	package: string;
	version: string;
}

export async function generateStaticParams() {
	const params: VersionRouteParams[] = [];

	await Promise.all(
		PACKAGES.map(async (packageName) => {
			const versions = (await fetchVersions(packageName)).slice(-N_RECENT_VERSIONS);

			params.push(...versions.map((version) => ({ package: packageName, version })));
		}),
	);

	return params;
}

function serializeIntoSidebarItemData(item: ApiItem, version: string): SidebarSectionItemData {
	return {
		kind: item.kind,
		name: item.displayName,
		href: resolveURI(item, version),
		overloadIndex: 'overloadIndex' in item ? (item.overloadIndex as number) : undefined,
	};
}

export default async function PackageLayout({ children, params }: PropsWithChildren<{ params: VersionRouteParams }>) {
	const modelJSON = await fetchModelJSON(params.package, params.version);
	const model = createApiModel(modelJSON);

	const pkg = model.tryGetPackageByName(params.package);

	if (!pkg) {
		return notFound();
	}

	const entry = pkg.entryPoints[0];

	if (!entry) {
		return notFound();
	}

	const { members } = entry;

	return (
		<div>
			<Header />
			<Nav members={members.map((member) => serializeIntoSidebarItemData(member, params.version))} />
			<div className="pt-18 lg:pl-76">{children}</div>
		</div>
	);
}
