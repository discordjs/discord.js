'use client';

import { useParams, useRouter } from 'next/navigation';
import { Select, SelectList, SelectOption, SelectTrigger } from '@/components/ui/Select';
import { DEFAULT_ENTRY_POINT, PACKAGES_WITH_ENTRY_POINTS } from '@/util/constants';

export function VersionSelect({ versions }: { readonly versions: { readonly version: string }[] }) {
	const router = useRouter();
	const params = useParams<{ packageName: string; version: string }>();

	const hasEntryPoints = PACKAGES_WITH_ENTRY_POINTS.includes(params.packageName);

	return (
		<Select
			aria-label="Select a version"
			defaultSelectedKey={params.version}
			key={`${params.packageName}-${params.version}`}
		>
			<SelectTrigger className="bg-[#f3f3f4] dark:bg-[#121214]" />
			<SelectList classNames={{ popover: 'bg-[#f3f3f4] dark:bg-[#28282d]' }} items={versions}>
				{(item) => (
					<SelectOption
						className="dark:pressed:bg-[#313135] bg-[#f3f3f4] dark:bg-[#28282d] dark:hover:bg-[#313135]"
						href={`/docs/packages/${params.packageName}/${item.version}${hasEntryPoints ? ['', ...DEFAULT_ENTRY_POINT].join('/') : ''}`}
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
