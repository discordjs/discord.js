import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import type { PropsWithChildren } from 'react';
import { Navigation } from '~/components/Navigation';
import { OverlayScrollbarsComponent } from '~/components/OverlayScrollbars';
import { Drawer } from '~/components/ui/Drawer';
import { Footer } from '~/components/ui/Footer';
import { fetchDependencies } from '~/util/fetchDependencies';

// eslint-disable-next-line promise/prefer-await-to-then
const CmdK = dynamic(async () => import('~/components/ui/CmdK').then((mod) => mod.CmdK), { ssr: false });

export async function generateMetadata({
	params,
}: {
	readonly params: { readonly packageName: string; readonly version: string };
}): Promise<Metadata> {
	return {
		title: {
			template: '%s | discord.js',
			default: `${params.packageName} (${params.version})`,
		},
	};
}

export default async function Layout({
	params,
	children,
}: PropsWithChildren<{ readonly params: { readonly packageName: string; readonly version: string } }>) {
	const dependencies = await fetchDependencies({ packageName: params.packageName, version: params.version });

	return (
		// eslint-disable-next-line react/no-unknown-property
		<div vaul-drawer-wrapper="" className="mx-auto flex max-w-screen-2xl flex-col gap-12 p-6 md:flex-row">
			<div className="sticky top-6 hidden flex-shrink-0 self-start md:block">
				<OverlayScrollbarsComponent
					className="max-h-[calc(100dvh-48px)]"
					defer
					options={{
						overflow: { x: 'hidden' },
						scrollbars: {
							autoHide: 'scroll',
							autoHideDelay: 500,
							autoHideSuspend: true,
							clickScroll: true,
						},
					}}
				>
					<Navigation className="pr-4" packageName={params.packageName} version={params.version} />
				</OverlayScrollbarsComponent>
			</div>
			<div className="pb-12">
				{children}
				<Footer />
			</div>
			<div className="fixed bottom-0 left-0 right-0 md:hidden">
				<Drawer>
					<Navigation
						className="max-w-none overflow-auto p-0 lg:max-w-none"
						packageName={params.packageName}
						version={params.version}
						drawer
					/>
				</Drawer>
			</div>
			<CmdK dependencies={dependencies} />
		</div>
	);
}
