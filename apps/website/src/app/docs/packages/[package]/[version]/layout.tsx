import { createApiModel } from '@discordjs/scripts';
import type { ApiFunction, ApiItem } from '@microsoft/api-extractor-model';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { PropsWithChildren } from 'react';
import vercelLogo from '../../../../../assets/powered-by-vercel.svg';
import { fetchModelJSON, fetchVersions } from '~/app/docAPI';
import { Header } from '~/components/Header';
import { Nav } from '~/components/Nav';
import type { SidebarSectionItemData } from '~/components/Sidebar';
import { resolveItemURI } from '~/components/documentation/util';
import { N_RECENT_VERSIONS, PACKAGES } from '~/util/constants';

export const dynamicParams = true;

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

function serializeIntoSidebarItemData(item: ApiItem): SidebarSectionItemData {
	return {
		kind: item.kind,
		name: item.displayName,
		href: resolveItemURI(item),
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

	const members = entry.members.filter((member) => {
		if (member.kind !== 'Function') {
			return true;
		}

		return (member as ApiFunction).overloadIndex === 1;
	});

	return (
		<div>
			<Header />
			<Nav members={members.map((member) => serializeIntoSidebarItemData(member))} />
			<article className="pt-18 lg:pl-76">
				<div className="relative z-10 min-h-[calc(100vh_-_70px)]">{children}</div>
				<div className="h-76 md:h-52" />
				<footer className="dark:bg-dark-600 h-76 lg:pl-84 bg-light-600 fixed bottom-0 left-0 right-0 md:h-52 md:pl-4 md:pr-16">
					<div className="mx-auto flex max-w-6xl flex-col place-items-center gap-12 pt-12 lg:place-content-center">
						<div className="flex w-full flex-col place-content-between place-items-center gap-12 md:flex-row md:gap-0">
							<a
								className="focus:ring-width-2 focus:ring-blurple rounded outline-0 focus:ring"
								href="https://vercel.com/?utm_source=discordjs&utm_campaign=oss"
								rel="noopener noreferrer"
								target="_blank"
								title="Vercel"
							>
								<Image alt="Vercel" src={vercelLogo} />
							</a>
							<div className="flex flex-row gap-6 md:gap-12">
								<div className="flex flex-col gap-2">
									<div className="text-lg font-semibold">Community</div>
									<div className="flex flex-col gap-1">
										<a
											className="focus:ring-width-2 focus:ring-blurple rounded outline-0 focus:ring"
											href="https://discord.gg/djs"
											rel="noopener noreferrer"
											target="_blank"
										>
											Discord
										</a>
										<a
											className="focus:ring-width-2 focus:ring-blurple rounded outline-0 focus:ring"
											href="https://github.com/discordjs/discord.js/discussions"
											rel="noopener noreferrer"
											target="_blank"
										>
											GitHub discussions
										</a>
									</div>
								</div>
								<div className="flex flex-col gap-2">
									<div className="text-lg font-semibold">Project</div>
									<div className="flex flex-col gap-1">
										<a
											className="focus:ring-width-2 focus:ring-blurple rounded outline-0 focus:ring"
											href="https://github.com/discordjs/discord.js"
											rel="noopener noreferrer"
											target="_blank"
										>
											discord.js
										</a>
										<a
											className="focus:ring-width-2 focus:ring-blurple rounded outline-0 focus:ring"
											href="https://discordjs.guide"
											rel="noopener noreferrer"
											target="_blank"
										>
											discord.js guide
										</a>
										<a
											className="focus:ring-width-2 focus:ring-blurple rounded outline-0 focus:ring"
											href="https://discord-api-types.dev"
											rel="noopener noreferrer"
											target="_blank"
										>
											discord-api-types
										</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</footer>
			</article>
		</div>
	);
}
