// import Link from 'next/link';
import type { PropsWithChildren } from 'react';
import { Footer } from '@/components/Footer';
import { Navigation } from '@/components/Navigation';
import { Scrollbars } from '@/components/OverlayScrollbars';
import { SidebarHeader } from '@/components/Sidebar';
import { Sidebar, SidebarContent, SidebarInset, SidebarTrigger } from '@/components/ui/Sidebar';
import { ENV } from '@/util/env';

export default async function Layout({ children }: PropsWithChildren) {
	return (
		<>
			<Sidebar closeButton={false} intent="inset">
				<SidebarHeader />
				<SidebarContent className="bg-[#f3f3f4] p-0 pb-4 pl-4 dark:bg-[#121214]">
					<Scrollbars>
						<Navigation />
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
				<div className="flex-1 bg-[#fbfbfb] pb-12 dark:bg-[#1a1a1e]">
					<div className="relative px-6 pt-6 md:hidden">
						<div className="fixed top-5 left-6 z-20 md:hidden">
							<SidebarTrigger aria-label="Navigation" size="icon" variant="filled" />
						</div>
						{/* <div className="flex place-content-end">
							<Link className="text-xl font-bold" href={`/docs/packages/${packageName}/${version}`}>
								{packageName}
							</Link>
						</div> */}
					</div>
					{children}
					<Footer />
				</div>
			</SidebarInset>
		</>
	);
}
