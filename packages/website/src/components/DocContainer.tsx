import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { TypeParamTable } from './TypeParamTable';
import { generateIcon } from '~/util/icon';
import type { TypeParameterData } from '~/util/parse.server';

export interface DocContainerProps {
	name: string;
	kind: string;
	excerpt: string;
	summary?: string | null;
	children?: JSX.Element;
	typeParams?: TypeParameterData[];
}

export function DocContainer({ name, kind, excerpt, summary, typeParams, children }: DocContainerProps) {
	return (
		<div className="px-10">
			<h1 className="font-mono flex items-center content-center break-all">
				{generateIcon(kind, 'mr-2')}
				{name}
			</h1>
			<h3>Code declaration:</h3>
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
			{typeParams?.length ? (
				<>
					<h3>Type Parameters</h3>
					<TypeParamTable data={typeParams} />
				</>
			) : null}
			<h3>Summary</h3>
			<p>{summary ?? 'No summary provided.'}</p>
			{children}
		</div>
	);
}
