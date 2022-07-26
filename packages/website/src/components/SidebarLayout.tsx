import type { PropsWithChildren } from 'react';
import { type ItemListProps, ItemSidebar } from './ItemSidebar';
import type { findMember } from '~/util/model.server';

export function SidebarLayout({
	packageName,
	data,
	children,
}: PropsWithChildren<Partial<ItemListProps & { data: { member: ReturnType<typeof findMember> } }>>) {
	return (
		<div className="flex flex-col lg:flex-row overflow-hidden max-w-full h-full max-h-full bg-white dark:bg-dark">
			<div className="h-full w-full lg:max-w-[370px] lg:min-w-[370px]">
				{packageName && data ? (
					<ItemSidebar packageName={packageName} data={data} selectedMember={data.member?.name} />
				) : null}
			</div>
			<div className="max-h-full grow overflow-x-hidden overflow-y-auto">{children}</div>
		</div>
	);
}
