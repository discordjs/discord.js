import Link from 'next/link';
import { Fragment } from 'react';
import { BuiltinDocumentationLinks } from '~/util/builtinDocumentationLinks';

export async function ExcerptNode({ node, version }: { readonly node?: any; readonly version: string }) {
	const createExcerpt = (excerpts: any) => {
		const excerpt = Array.isArray(excerpts) ? excerpts : excerpts.excerpts ?? [excerpts];

		return (
			<span
				className={
					excerpts?.type === 'Extends' || excerpts?.type === 'Implements'
						? 'after:content-[",_"] last-of-type:after:content-none'
						: ''
				}
			>
				{excerpt.map((excerpt: any, idx: number) => {
					if (excerpt.resolvedItem) {
						return (
							<Link
								key={`${excerpt.resolvedItem.displayName}-${idx}`}
								className="text-blurple hover:text-blurple-500 dark:hover:text-blurple-300"
								href={`/docs/packages/${excerpt.resolvedItem.packageName}/${excerpt.resolvedItem.version ?? version}/${excerpt.resolvedItem.uri}`}
							>
								{excerpt.text}
							</Link>
						);
					}

					if (excerpt.href) {
						return (
							<a
								key={`${excerpt.text}-${idx}`}
								className="text-blurple hover:text-blurple-500 dark:hover:text-blurple-300"
								href={excerpt.href}
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
								key={`${excerpt.text}-${idx}`}
								className="text-blurple hover:text-blurple-500 dark:hover:text-blurple-300"
								href={href}
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
