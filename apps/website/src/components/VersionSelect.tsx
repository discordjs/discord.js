'use client';

import { useParams, useRouter } from 'next/navigation';
import { use } from 'react';
import { Select, SelectList, SelectOption, SelectTrigger } from './ui/Select';

export function VersionSelect({
	versionsPromise,
}: {
	readonly versionsPromise: Promise<{ readonly version: string }[]>;
}) {
	const router = useRouter();
	const params = useParams();
	const versions = use(versionsPromise);

	return (
		<Select aria-label="Select a version" defaultSelectedKey={params.version as string}>
			<SelectTrigger className="bg-[#f3f3f4] dark:bg-[#121214]" />
			<SelectList classNames={{ popover: 'bg-[#f3f3f4] dark:bg-[#28282d]' }} items={versions}>
				{(item) => (
					<SelectOption
						className="dark:pressed:bg-[#313135] bg-[#f3f3f4] dark:bg-[#28282d] dark:hover:bg-[#313135]"
						href={`/docs/packages/${params.packageName}/${item.version}`}
						id={item.version}
						key={item.version}
						onHoverStart={() => router.prefetch(`/docs/packages/${params.packageName}/${item.version}`)}
						textValue={item.version}
					>
						{item.version}
					</SelectOption>
				)}
			</SelectList>
		</Select>
	);
}
