import type { ReactNode } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { Section } from './Section';
import { TypeParamTable } from './TypeParamTable';
import { generateIcon } from '~/util/icon';
import type { TokenDocumentation, TypeParameterData } from '~/util/parse.server';
import { HyperlinkedText } from '~/util/util';

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
			<div className="bg-white border-b-solid border-gray border-width-0.5 sticky top-0 px-10 py-2">
				<h2 className="font-mono break-all m-0">
					{generateIcon(kind, 'mr-2')}
					{name}
				</h2>
			</div>

			<div className="p-10">
				<div>
					<SyntaxHighlighter
						wrapLines
						wrapLongLines
						language="typescript"
						style={vs}
						codeTagProps={{ style: { fontFamily: 'JetBrains Mono' } }}
					>
						{excerpt}
					</SyntaxHighlighter>
				</div>
				{extendsTokens?.length ? (
					<div className="flex flex-row items-center">
						<h2 className="mr-5">Extends</h2>
						<p className="font-mono">
							<HyperlinkedText tokens={extendsTokens} />
						</p>
					</div>
				) : null}
				<Section title="Summary">
					<p className="color-slate-500">{summary ?? 'No summary provided.'}</p>
				</Section>
				{typeParams?.length ? (
					<Section title="Type Parameters">
						<TypeParamTable data={typeParams} className="mb-5 p-3" />
					</Section>
				) : null}
				<div>{children}</div>
			</div>
		</>
	);
}
