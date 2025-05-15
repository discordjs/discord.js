'use client';

import { useParams, useRouter } from 'next/navigation';
import { parseDocsPathParams } from '@/util/parseDocsPathParams';
import { Select, SelectList, SelectOption, SelectTrigger } from './ui/Select';

export function EntryPointSelect({ entryPoints }: { readonly entryPoints: { readonly entryPoint: string }[] }) {
	const router = useRouter();
	const params = useParams<{
		item?: string[] | undefined;
		packageName: string;
		version: string;
	}>();

	const { entryPoints: parsedEntrypoints } = parseDocsPathParams(params.item);

	return (
		<Select
			aria-label="Select an entrypoint"
			defaultSelectedKey={parsedEntrypoints.join('/')}
			key={parsedEntrypoints.join('/')}
		>
			<SelectTrigger className="bg-[#f3f3f4] dark:bg-[#121214]" />
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
