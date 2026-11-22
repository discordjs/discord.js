import { LinkIcon } from 'lucide-react';
import Link from 'next/link';
import { Fragment } from 'react';
import { cx } from '@/styles/cva';
import { ENV } from '@/util/env';
import { Badges } from './Badges';
import { DocNode } from './DocNode';
import { ExcerptNode } from './ExcerptNode';

export async function TypeParameterNode({
	description = false,
	node,
	version,
}: {
	readonly description?: boolean;
	readonly node: any;
	readonly version: string;
}) {
	return (
		<div className={`${description ? 'flex flex-col gap-4' : 'inline-block'}`}>
			{node.map((typeParameter: any, idx: number) => (
				<Fragment key={`${typeParameter.name}-${idx}`}>
					<div className={description ? '' : 'inline after:content-[",_"] last-of-type:after:content-none'}>
						<h3
							className={cx(
								ENV.IS_LOCAL_DEV || ENV.IS_PREVIEW ? 'scroll-mt-16' : 'scroll-mt-8',
								'group inline font-mono font-semibold break-words',
								description ? 'inline-block px-2' : '',
							)}
							id={typeParameter.name}
						>
							{description ? <Badges node={typeParameter} /> : null}
							<span>
								{description ? (
									<Link className="float-left -ml-6 hidden pr-2 pb-2 group-hover:block" href={`#${typeParameter.name}`}>
										<LinkIcon aria-hidden size={16} />
									</Link>
								) : null}
								{typeParameter.name}
								{typeParameter.isOptional ? '?' : ''}
								{typeParameter.constraintsExcerpt.length ? (
									<>
										{' extends '}
										<ExcerptNode node={typeParameter.constraintsExcerpt} version={version} />
									</>
								) : null}
								{typeParameter.defaultExcerpt.length ? (
									<>
										{' = '}
										<ExcerptNode node={typeParameter.defaultExcerpt} version={version} />
									</>
								) : null}
							</span>
						</h3>

						{description && typeParameter.description?.length ? (
							<div className="pl-4">
								<DocNode node={typeParameter.description} version={version} />
							</div>
						) : null}
					</div>
				</Fragment>
			))}
			{description ? (
				<div aria-hidden className="p-4">
					<div className="h-[2px] bg-neutral-300 dark:bg-neutral-700" role="separator" />
				</div>
			) : null}
		</div>
	);
}
