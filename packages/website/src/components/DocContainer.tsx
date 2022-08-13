import type { ReactNode } from 'react';
import { VscListSelection, VscSymbolParameter } from 'react-icons/vsc';
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { CodeListingSeparatorType } from './CodeListing';
import { CommentSection } from './Comment';
import { HyperlinkedText } from './HyperlinkedText';
import { Section } from './Section';
import { TypeParamTable } from './TypeParamTable';
import type { DocItem } from '~/DocModel/DocItem';
import { generateIcon } from '~/util/icon';
import type { TokenDocumentation, TypeParameterData } from '~/util/parse.server';

export interface DocContainerProps {
	name: string;
	kind: string;
	excerpt: string;
	summary?: ReturnType<DocItem['toJSON']>['summary'];
	children?: ReactNode;
	extendsTokens?: TokenDocumentation[] | null;
	implementsTokens?: TokenDocumentation[][];
	typeParams?: TypeParameterData[];
}

export function DocContainer({
	name,
	kind,
	excerpt,
	summary,
	typeParams,
	children,
	extendsTokens,
	implementsTokens,
}: DocContainerProps) {
	return (
		<div className="flex flex-col min-h-full max-h-full grow">
			<div className="border-0.5 border-gray px-10 py-2">
				<h2 className="flex gap-2 items-center break-all m-0 dark:text-white">
					{generateIcon(kind)}
					{name}
				</h2>
			</div>

			<div className="min-h-full overflow-y-auto overflow-x-clip px-10 pt-5 pb-10">
				<Section iconElement={<VscListSelection />} title="Summary" className="dark:text-white">
					{summary ? (
						<CommentSection textClassName="text-dark-100 dark:text-gray-300" node={summary} />
					) : (
						<p className="text-dark-100 dark:text-gray-300">No summary provided.</p>
					)}
				</Section>
				<SyntaxHighlighter
					wrapLines
					wrapLongLines
					language="typescript"
					style={vscDarkPlus}
					codeTagProps={{ style: { fontFamily: 'JetBrains Mono' } }}
				>
					{excerpt}
				</SyntaxHighlighter>
				{extendsTokens?.length ? (
					<div className="flex flex-row items-center dark:text-white gap-3">
						<h3 className="m-0">Extends</h3>
						<h3 className="m-0">{CodeListingSeparatorType.Type}</h3>
						<p className="font-mono break-all">
							<HyperlinkedText tokens={extendsTokens} />
						</p>
					</div>
				) : null}
				{implementsTokens?.length ? (
					<div className="flex flex-row items-center dark:text-white gap-3">
						<h3 className="m-0">Implements</h3>
						<h3 className="m-0">{CodeListingSeparatorType.Type}</h3>
						<p className="font-mono break-all">
							{implementsTokens.map((token, i) => (
								<>
									<HyperlinkedText key={i} tokens={token} />
									{i < implementsTokens.length - 1 ? ', ' : ''}
								</>
							))}
						</p>
					</div>
				) : null}
				<div className="space-y-10">
					{typeParams?.length ? (
						<Section
							iconElement={<VscSymbolParameter />}
							title="Type Parameters"
							className="dark:text-white"
							defaultClosed
						>
							<TypeParamTable data={typeParams} />
						</Section>
					) : null}
					<div className="space-y-10">{children}</div>
				</div>
			</div>
		</div>
	);
}
