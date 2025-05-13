'use client';

import { useParams, useRouter } from 'next/navigation';
import { use } from 'react';
import { parseDocsPathParams } from '@/util/parseDocsPathParams';
import { Select, SelectList, SelectOption, SelectTrigger } from './ui/Select';

export function EntryPointSelect({
	entryPointsPromise,
}: {
	readonly entryPointsPromise: Promise<{ readonly entryPoint: string }[]>;
}) {
	const router = useRouter();
	const params = useParams();
	const entryPoints = use(entryPointsPromise);

	const { entryPoints: parsedEntrypoints } = parseDocsPathParams(params.item as string[] | undefined);

	return (
		<Select aria-label="Select an entrypoint" defaultSelectedKey={parsedEntrypoints.join('/')}>
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
