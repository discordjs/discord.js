import { Code } from 'bright';

export function SyntaxHighlighter({ language = 'typescript', code }: { code: string; language?: string }) {
	return (
		<>
			<div data-theme="dark">
				{/* @ts-expect-error async component */}
				<Code codeClassName="font-mono" language={language} theme="dark-plus">
					{code}
				</Code>
			</div>
			<div data-theme="light">
				{/* @ts-expect-error async component */}
				<Code codeClassName="font-mono" language={language} theme="light-plus">
					{code}
				</Code>
			</div>
		</>
	);
}
