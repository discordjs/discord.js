import type { PropsWithChildren } from 'react';
import { type ItemListProps, ItemSidebar } from './ItemSidebar';
import type { findMember } from '~/util/model.server';

export function SidebarLayout({
	packageName,
	data,
	children,
}: PropsWithChildren<Partial<ItemListProps & { data: { member: ReturnType<typeof findMember> } }>>) {
	return (
		<div className="flex flex-col max-w-full h-full max-h-full bg-white dark:bg-dark">
			<div className="flex min-h-[40px] border-0.5 border-b-0 border-gray items-center m-0 px-2 dark:text-white">
				Breadcrumbs
			</div>
			<div className="flex flex-col lg:flex-row overflow-hidden">
				<div className="h-full w-full lg:max-w-[310px] lg:min-w-[310px]">
					{packageName && data ? (
						<ItemSidebar packageName={packageName} data={data} selectedMember={data.member} />
					) : null}
				</div>
				<div className="h-full grow">{children}</div>
				<div className="h-full w-full lg:max-w-[310px] lg:min-w-[310px]">
					{packageName && data?.member ? (
						<ItemSidebar packageName={packageName} data={data} selectedMember={data.member} />
					) : null}
				</div>
			</div>
		</div>
	);
}
