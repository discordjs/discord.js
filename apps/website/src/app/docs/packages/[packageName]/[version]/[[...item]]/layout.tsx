'use cache';

import { VscGithubInverted } from '@react-icons/all-files/vsc/VscGithubInverted';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense, type PropsWithChildren } from 'react';
import { EntryPointSelect } from '@/components/EntrypointSelect';
import { Footer } from '@/components/Footer';
import { Navigation } from '@/components/Navigation';
import { Scrollbars } from '@/components/OverlayScrollbars';
import { PackageSelect } from '@/components/PackageSelect';
import { SearchButton } from '@/components/SearchButton';
import { ThemeSwitchNoSRR } from '@/components/ThemeSwitch';
import { VersionSelect } from '@/components/VersionSelect';
import { Sidebar, SidebarContent, SidebarHeader, SidebarInset, SidebarTrigger } from '@/components/ui/Sidebar';
import { buttonStyles } from '@/styles/ui/button';
import { PACKAGES_WITH_ENTRY_POINTS } from '@/util/constants';
import { ENV } from '@/util/env';
import { fetchEntryPoints } from '@/util/fetchEntryPoints';
import { fetchVersions } from '@/util/fetchVersions';
import { parseDocsPathParams } from '@/util/parseDocsPathParams';
import { CmdK } from './CmdK';

export async function generateMetadata({
	params,
}: {
	readonly params: Promise<{
		readonly item?: string[] | undefined;
		readonly packageName: string;
		readonly version: string;
	}>;
}): Promise<Metadata> {
	const { packageName, version } = await params;

	return {
		title: {
			template: '%s | discord.js',
			default: `${packageName} (${version})`,
		},
	};
}

export default async function Layout({
	params,
	children,
}: PropsWithChildren<{
	readonly params: Promise<{
		readonly item?: string[] | undefined;
		readonly packageName: string;
		readonly version: string;
	}>;
}>) {
	const { packageName, version, item } = await params;

	const versions = fetchVersions(packageName);

	const hasEntryPoints = PACKAGES_WITH_ENTRY_POINTS.includes(packageName);

	const entryPoints = hasEntryPoints ? fetchEntryPoints(packageName, version) : Promise.resolve([]);
	const { entryPoints: parsedEntrypoints } = parseDocsPathParams(item);

	return (
		<>
			<Sidebar closeButton={false} intent="inset">
				<SidebarHeader className="bg-[#f3f3f4] p-4 dark:bg-[#121214]">
					<div className="flex flex-col gap-2">
						<div className="flex place-content-between place-items-center p-1">
							<Link className="text-xl font-bold" href={`/docs/packages/${packageName}/${version}`}>
								{packageName}
							</Link>
							<div className="flex place-items-center gap-2">
								<Link
									aria-label="GitHub"
									className={buttonStyles({ variant: 'filled', size: 'icon-sm' })}
									href="https://github.com/discordjs/discord.js"
									rel="external noopener noreferrer"
									target="_blank"
								>
									<VscGithubInverted aria-hidden data-slot="icon" size={18} />
								</Link>
								<ThemeSwitchNoSRR />
							</div>
						</div>
						<PackageSelect />
						{/* <h3 className="p-1 text-lg font-semibold">{version}</h3> */}
						<VersionSelect versionsPromise={versions} />
						{hasEntryPoints ? <EntryPointSelect entryPointsPromise={entryPoints} /> : null}
						<SearchButton />
					</div>
				</SidebarHeader>
				<SidebarContent className="bg-[#f3f3f4] p-0 py-4 pl-4 dark:bg-[#121214]">
					<Scrollbars>
						<Navigation entryPoint={parsedEntrypoints.join('.')} packageName={packageName} version={version} />
					</Scrollbars>
				</SidebarContent>
			</Sidebar>
			<SidebarInset>
				{ENV.IS_LOCAL_DEV ? (
					<div className="sticky top-0 z-10 flex place-content-center place-items-center border border-red-400/35 bg-red-500/65 p-2 px-4 text-center text-base text-white shadow-md backdrop-blur">
						Local test environment
					</div>
				) : null}
				{ENV.IS_PREVIEW ? (
					<div className="sticky top-0 z-10 flex place-content-center place-items-center border border-red-400/35 bg-red-500/65 p-2 px-4 text-center text-base text-white shadow-md backdrop-blur">
						Preview environment
					</div>
				) : null}
				<div className="bg-[#fbfbfb] pb-12 dark:bg-[#1a1a1e]">
					<div className="relative px-6 pt-6 md:hidden">
						<div className="fixed top-5 left-6 z-20 md:hidden">
							<SidebarTrigger aria-label="Navigation" size="icon" variant="filled" />
						</div>
						<div className="flex place-content-end">
							<Link className="text-xl font-bold" href={`/docs/packages/${packageName}/${version}`}>
								{packageName}
							</Link>
						</div>
					</div>
					{children}
					<Footer />
				</div>
			</SidebarInset>
			<Suspense>
				<CmdK params={params} />
			</Suspense>
		</>
	);
}
