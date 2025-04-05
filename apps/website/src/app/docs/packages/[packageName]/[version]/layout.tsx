import { VscGithubInverted } from '@react-icons/all-files/vsc/VscGithubInverted';
import type { Metadata } from 'next';
import Link from 'next/link';
import type { PropsWithChildren } from 'react';
import { Navigation } from '@/components/Navigation';
import { Scrollbars } from '@/components/OverlayScrollbars';
import { PackageSelect } from '@/components/PackageSelect';
import { SearchButton } from '@/components/SearchButton';
import { ThemeSwitchNoSRR } from '@/components/ThemeSwitch';
import { VersionSelect } from '@/components/VersionSelect';
// import { CmdKNoSRR } from '@/components/ui/CmdK';
// import { Drawer } from '@/components/ui/Drawer';
// import { Footer } from '@/components/ui/Footer';
import { Sidebar, SidebarContent, SidebarHeader, SidebarInset } from '@/components/ui/Sidebar';
import { buttonStyles } from '@/styles/ui/button';
// import { fetchDependencies } from '@/util/fetchDependencies';
import { fetchVersions } from '@/util/fetchVersions';

export async function generateMetadata({
	params,
}: {
	readonly params: Promise<{ readonly packageName: string; readonly version: string }>;
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
}: PropsWithChildren<{ readonly params: Promise<{ readonly packageName: string; readonly version: string }> }>) {
	const { packageName, version } = await params;

	// const dependencies = await fetchDependencies({ packageName, version });
	const versions = await fetchVersions(packageName);

	// return (
	// 	<div vaul-drawer-wrapper="" className="mx-auto flex max-w-screen-2xl flex-col gap-12 p-6 md:flex-row">
	// 		<div className="sticky top-6 hidden flex-shrink-0 self-start md:block">
	// 			<OverlayScrollbarsComponent
	// 				className="max-h-[calc(100dvh-48px)]"
	// 				defer
	// 				options={{
	// 					overflow: { x: 'hidden' },
	// 					scrollbars: {
	// 						autoHide: 'scroll',
	// 						autoHideDelay: 500,
	// 						autoHideSuspend: true,
	// 						clickScroll: true,
	// 					},
	// 				}}
	// 			>
	// 				<Navigation className="pr-4" packageName={params.packageName} version={params.version} />
	// 			</OverlayScrollbarsComponent>
	// 		</div>
	// 		<div className="pb-12">
	// 			{children}
	// 			<Footer />
	// 		</div>
	// 		<div className="fixed right-0 bottom-0 left-0 md:hidden">
	// 			<Drawer>
	// 				<Navigation
	// 					className="max-w-none overflow-auto p-0 lg:max-w-none"
	// 					packageName={params.packageName}
	// 					version={params.version}
	// 					drawer
	// 				/>
	// 			</Drawer>
	// 		</div>
	// 		<CmdKNoSRR dependencies={dependencies} />
	// 	</div>
	// );

	return (
		<>
			<Sidebar intent="inset">
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
						<PackageSelect packageName={packageName} />
						{/* <h3 className="p-1 text-lg font-semibold">{version}</h3> */}
						<VersionSelect packageName={packageName} version={version} versions={versions} />
						<SearchButton />
					</div>
				</SidebarHeader>
				<SidebarContent className="bg-[#f3f3f4] p-0 py-4 pl-4 dark:bg-[#121214]">
					<Scrollbars>
						<Navigation packageName={packageName} version={version} />
					</Scrollbars>
				</SidebarContent>
			</Sidebar>
			<SidebarInset>
				<div className="bg-[#fbfbfb] dark:bg-[#1a1a1e]">{children}</div>
			</SidebarInset>
		</>
	);
}
