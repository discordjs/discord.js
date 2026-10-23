'use client';

import { useParams, useRouter } from 'next/navigation';
import { Select, SelectList, SelectOption, SelectTrigger } from '@/components/ui/Select';
import { PACKAGES } from '@/util/constants';

export function PackageSelect() {
	const router = useRouter();
	const params = useParams<{
		packageName: string;
	}>();

	return (
		<Select aria-label="Select a package" defaultSelectedKey={params.packageName} key={params.packageName}>
			<SelectTrigger className="bg-[#f3f3f4] dark:bg-[#121214]" />
			<SelectList classNames={{ popover: 'bg-[#f3f3f4] dark:bg-[#28282d]' }} items={PACKAGES}>
				{(item) => (
					<SelectOption
						className="dark:pressed:bg-[#313135] bg-[#f3f3f4] dark:bg-[#28282d] dark:hover:bg-[#313135]"
						href={`/docs/packages/${item.name}/stable`}
						id={item.name}
						key={item.name}
						onHoverStart={() => router.prefetch(`/docs/packages/${item.name}/stable`)}
						textValue={item.name}
					>
						{item.name}
					</SelectOption>
				)}
			</SelectList>
		</Select>
	);
}
