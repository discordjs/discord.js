import Link from 'next/link';
import { Fragment } from 'react';
import { BuiltinDocumentationLinks } from '@/util/builtinDocumentationLinks';

export async function ExcerptNode({ node, version }: { readonly node?: any; readonly version: string }) {
	const createExcerpt = (excerpts: any, idx: number) => {
		const excerpt = Array.isArray(excerpts) ? excerpts : (excerpts.excerpts ?? [excerpts]);

		return (
			<span
				className={
					excerpts?.type === 'Extends' || excerpts?.type === 'Implements'
						? 'after:content-[",_"] last-of-type:after:content-none'
						: ''
				}
				key={`${excerpt.text}-${idx}`}
			>
				{excerpt.map((excerpt: any, idx: number) => {
					if (excerpt.resolvedItem) {
						return (
							<Link
								className="text-base-blurple-400 hover:text-base-blurple-500 dark:hover:text-base-blurple-300"
								href={`/docs/packages/${excerpt.resolvedItem.packageName}/${excerpt.resolvedItem.version ?? version}/${excerpt.resolvedItem.uri}`}
								key={`${excerpt.resolvedItem.displayName}-${idx}`}
								// @ts-expect-error - unstable_dynamicOnHover is not part of the public types
								unstable_dynamicOnHover
							>
								{excerpt.text}
							</Link>
						);
					}

					if (excerpt.href) {
						return (
							<a
								className="text-base-blurple-400 hover:text-base-blurple-500 dark:hover:text-base-blurple-300"
								href={excerpt.href}
								key={`${excerpt.text}-${idx}`}
								rel="external noreferrer noopener"
								target="_blank"
							>
								{excerpt.text}
							</a>
						);
					}

					if (excerpt.text in BuiltinDocumentationLinks) {
						const href = BuiltinDocumentationLinks[excerpt.text as keyof typeof BuiltinDocumentationLinks];

						return (
							<a
								className="text-base-blurple-400 hover:text-base-blurple-500 dark:hover:text-base-blurple-300"
								href={href}
								key={`${excerpt.text}-${idx}`}
								rel="external noreferrer noopener"
								target="_blank"
							>
								{excerpt.text}
							</a>
						);
					}

					return <Fragment key={`${excerpt.text}-${idx}`}>{excerpt.text}</Fragment>;
				})}
			</span>
		);
	};

	return node?.map(createExcerpt) ?? null;
}
