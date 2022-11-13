import { PrismAsyncLight } from 'react-syntax-highlighter';
import { vscDarkPlus, prism } from 'react-syntax-highlighter/dist/cjs/styles/prism';

export function SyntaxHighlighter({ language = 'typescript', code }: { code: string; language?: string }) {
	return (
		<>
			<div data-theme="dark">
				<PrismAsyncLight
					codeTagProps={{ style: { fontFamily: 'JetBrains Mono' } }}
					language={language}
					style={vscDarkPlus}
					wrapLines
					wrapLongLines
				>
					{code}
				</PrismAsyncLight>
			</div>
			<div data-theme="light">
				<PrismAsyncLight
					codeTagProps={{ style: { fontFamily: 'JetBrains Mono' } }}
					language={language}
					style={prism}
					wrapLines
					wrapLongLines
				>
					{code}
				</PrismAsyncLight>
			</div>
		</>
	);
}
