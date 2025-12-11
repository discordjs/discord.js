'use client';

import { Loader2Icon } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { Select, SelectList, SelectOption, SelectTrigger } from '@/components/ui/Select';
import type { EntryPoint } from '@/util/fetchEntryPoints';
import { parseDocsPathParams } from '@/util/parseDocsPathParams';

export function EntryPointSelect({
	entryPoints,
	isLoading,
}: {
	readonly entryPoints: EntryPoint[];
	readonly isLoading: boolean;
}) {
	const router = useRouter();
	const params = useParams<{
		item?: string[] | undefined;
		packageName: string;
		version: string;
	}>();

	const { entryPoints: parsedEntrypoints } = parseDocsPathParams(params.item);

	return (
		<Select
			aria-label={isLoading ? 'Loading entrypoints...' : 'Select an entrypoint'}
			defaultSelectedKey={parsedEntrypoints.join('/')}
			key={parsedEntrypoints.join('/')}
			placeholder={isLoading ? 'Loading entrypoints...' : 'Select an entrypoint'}
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
			<SelectList classNames={{ popover: 'bg-[#f3f3f4] dark:bg-[#28282d]' }} items={entryPoints}>
				{(item) => (
					<SelectOption
						className="dark:pressed:bg-[#313135] bg-[#f3f3f4] dark:bg-[#28282d] dark:hover:bg-[#313135]"
						href={`/docs/packages/${params.packageName}/${params.version}/${item.entryPoint}`}
						id={item.entryPoint}
						key={item.entryPoint}
						onHoverStart={() =>
							router.prefetch(`/docs/packages/${params.packageName}/${params.version}/${item.entryPoint}`)
						}
						textValue={item.entryPoint}
					>
						{item.entryPoint}
					</SelectOption>
				)}
			</SelectList>
		</Select>
	);
}
