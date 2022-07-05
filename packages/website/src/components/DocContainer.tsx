import { VscSymbolClass, VscSymbolMethod, VscSymbolEnum, VscSymbolInterface, VscSymbolVariable } from 'react-icons/vsc';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { TypeParamTable } from './TypeParamTable';
import type { TypeParameterData } from '~/util/parse.server';

export interface DocContainerProps {
	name: string;
	kind: string;
	excerpt: string;
	summary?: string | null;
	children?: JSX.Element;
	typeParams?: TypeParameterData[];
}

const symbolClass = 'mr-2';
const icons = {
	Class: <VscSymbolClass color="blue" className={symbolClass} />,
	Method: <VscSymbolMethod className={symbolClass} />,
	Function: <VscSymbolMethod color="purple" className={symbolClass} />,
	Enum: <VscSymbolEnum className={symbolClass} />,
	Interface: <VscSymbolInterface color="blue" className={symbolClass} />,
	TypeAlias: <VscSymbolVariable color="blue" className={symbolClass} />,
};

export function DocContainer({ name, kind, excerpt, summary, typeParams, children }: DocContainerProps) {
	return (
		<div className="px-10">
			<h1 style={{ fontFamily: 'JetBrains Mono' }} className="flex items-csenter content-center">
				{icons[kind as keyof typeof icons]}
				{name}
			</h1>
			<h3>Code declaration:</h3>
			<SyntaxHighlighter language="typescript" style={vs} codeTagProps={{ style: { fontFamily: 'JetBrains Mono' } }}>
				{excerpt}
			</SyntaxHighlighter>
			{typeParams && typeParams.length > 0 && (
				<>
					<h3>Type Parameters</h3>
					<TypeParamTable data={typeParams} />
				</>
			)}
			<h3>Summary</h3>
			<p>{summary ?? 'No summary provided.'}</p>
			{children}
		</div>
	);
}
