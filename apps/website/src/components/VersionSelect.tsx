'use client';

import { Loader2Icon } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { Select, SelectList, SelectOption, SelectTrigger } from '@/components/ui/Select';
import { DEFAULT_ENTRY_POINT, PACKAGES_WITH_ENTRY_POINTS } from '@/util/constants';

export function VersionSelect({
	versions,
	isLoading,
}: {
	readonly isLoading: boolean;
	readonly versions: { readonly version: string }[];
}) {
	const router = useRouter();
	const params = useParams<{ packageName: string; version: string }>();

	const hasEntryPoints = PACKAGES_WITH_ENTRY_POINTS.includes(params.packageName);

	return (
		<Select
			aria-label={isLoading ? 'Loading versions...' : 'Select a version'}
			defaultSelectedKey={params.version}
			key={`${params.packageName}-${params.version}`}
			placeholder={isLoading ? 'Loading versions...' : 'Select a version'}
		>
			<SelectTrigger
				className="bg-[#f3f3f4] dark:bg-[#121214]"
				suffix={
					isLoading ? (
						<Loader2Icon
							aria-hidden
							className="size-6 shrink-0 animate-spin duration-200 forced-colors:text-[ButtonText] forced-colors:group-disabled:text-[GrayText]"
							size={24}
							strokeWidth={1.5}
						/>
					) : null
				}
			/>
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
