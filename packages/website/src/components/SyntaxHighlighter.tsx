import { PrismAsyncLight } from 'react-syntax-highlighter';
import { vscDarkPlus, prism } from 'react-syntax-highlighter/dist/cjs/styles/prism';

export function SyntaxHighlighter({ language = 'typescript', code }: { code: string; language?: string }) {
	return (
		<>
			<div data-theme="dark">
				<PrismAsyncLight
					wrapLines
					wrapLongLines
					language={language}
					style={vscDarkPlus}
					codeTagProps={{ style: { fontFamily: 'JetBrains Mono' } }}
				>
					{code}
				</PrismAsyncLight>
			</div>
			<div data-theme="light">
				<PrismAsyncLight
					wrapLines
					wrapLongLines
					language={language}
					style={prism}
					codeTagProps={{ style: { fontFamily: 'JetBrains Mono' } }}
				>
					{code}
				</PrismAsyncLight>
			</div>
		</>
	);
}
