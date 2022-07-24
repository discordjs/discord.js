import type { ReactNode } from 'react';
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
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
			<div className="bg-white dark:bg-dark border-b-solid border-gray border-width-0.5 sticky top-0 px-10 py-2">
				<h2 className="flex items-center font-mono break-all m-0 dark:text-white">
					{generateIcon(kind, 'mr-2')}
					{name}
				</h2>
			</div>

			<div className="px-10 pt-5 pb-10">
				<div>
					<SyntaxHighlighter
						wrapLines
						wrapLongLines
						language="typescript"
						style={vscDarkPlus}
						codeTagProps={{ style: { fontFamily: 'JetBrains Mono' } }}
					>
						{excerpt}
					</SyntaxHighlighter>
				</div>
				{extendsTokens?.length ? (
					<div className="flex flex-row items-center dark:text-white">
						<h2 className="mr-5">Extends</h2>
						<p className="font-mono">
							<HyperlinkedText tokens={extendsTokens} />
						</p>
					</div>
				) : null}
				<Section title="Summary" className="dark:text-white">
					<p className="text-dark-100 dark:text-gray-400">{summary ?? 'No summary provided.'}</p>
				</Section>
				{typeParams?.length ? (
					<Section title="Type Parameters" className="dark:text-white">
						<TypeParamTable data={typeParams} className="mb-5 p-3" />
					</Section>
				) : null}
				<div>{children}</div>
			</div>
		</>
	);
}
