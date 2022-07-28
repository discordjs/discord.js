import type { ReactNode } from 'react';
import { VscListSelection, VscSymbolParameter } from 'react-icons/vsc';
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { CodeListingSeparatorType } from './CodeListing';
import { HyperlinkedText } from './HyperlinkedText';
import { Section } from './Section';
import { TypeParamTable } from './TypeParamTable';
import { generateIcon } from '~/util/icon';
import type { TokenDocumentation, TypeParameterData } from '~/util/parse.server';

export interface DocContainerProps {
	name: string;
	kind: string;
	excerpt: string;
	summary?: string | null;
	children?: ReactNode;
	extendsTokens?: TokenDocumentation[] | null;
	typeParams?: TypeParameterData[];
}

export function DocContainer({ name, kind, excerpt, summary, typeParams, children, extendsTokens }: DocContainerProps) {
	return (
		<>
			<div className="bg-white dark:bg-dark border-b-solid border-gray border-0.5 border-width-0.5 sticky top-0 px-10 py-2">
				<h2 className="flex gap-2 items-center break-all m-0 dark:text-white">
					{generateIcon(kind)}
					{name}
				</h2>
			</div>

			<div className="px-10 pt-5 pb-10">
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
						<h3 className="m-0">Extends:</h3>
						<h3 className="m-0">{CodeListingSeparatorType.Type}</h3>
						<p className="font-mono break-all">
							<HyperlinkedText tokens={extendsTokens} />
						</p>
					</div>
				) : null}
				<div className="space-y-10">
					<Section iconElement={<VscListSelection />} title="Summary" className="dark:text-white">
						<p className="text-dark-100 dark:text-gray-300 m-0">{summary ?? 'No summary provided.'}</p>
					</Section>
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
		</>
	);
}
