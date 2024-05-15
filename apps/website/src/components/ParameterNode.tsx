import { LinkIcon } from 'lucide-react';
import Link from 'next/link';
import { Fragment } from 'react';
import { Badges } from './Badges';
import { DocNode } from './DocNode';
import { ExcerptNode } from './ExcerptNode';

export async function ParameterNode({
	description = false,
	node,
	version,
}: {
	readonly description?: boolean;
	readonly node: any;
	readonly version: string;
}) {
	return (
		<div className={`${description ? 'flex flex-col gap-8' : 'inline'}`}>
			{node.map((parameter: any, idx: number) => {
				return (
					<Fragment key={`${parameter.name}-${idx}`}>
						<div className={description ? 'group' : 'inline after:content-[",_"] last-of-type:after:content-none'}>
							<span className="font-mono font-semibold">
								{description ? (
									<Link href={`#${parameter.name}`} className="float-left -ml-6 hidden pb-2 pr-2 group-hover:block">
										<LinkIcon aria-hidden size={16} />
									</Link>
								) : null}
								{description ? <Badges node={parameter} /> : null}
								{parameter.name}
								{parameter.isOptional ? '?' : ''}: <ExcerptNode node={parameter.typeExcerpt} version={version} />
							</span>
							{description && parameter.description?.length ? (
								<div className="mt-4 pl-4">
									<DocNode node={parameter.description} version={version} />
								</div>
							) : null}
						</div>
					</Fragment>
				);
			})}
			{description ? (
				<div aria-hidden className="px-4">
					<div role="separator" className="h-[2px] bg-neutral-300 dark:bg-neutral-700" />
				</div>
			) : null}
		</div>
	);
}
