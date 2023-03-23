import { Code } from 'bright';

export function SyntaxHighlighter(props: typeof Code) {
	return (
		<>
			<div data-theme="dark">
				{/* @ts-expect-error async component */}
				<Code codeClassName="font-mono" lang={props.lang ?? 'typescript'} {...props} theme="github-dark-dimmed" />
			</div>
			<div className="[&_pre]:rounded-md [&_pre]:border [&_pre]:border-gray-300" data-theme="light">
				{/* @ts-expect-error async component */}
				<Code codeClassName="font-mono" lang={props.lang ?? 'typescript'} {...props} theme="min-light" />
			</div>
		</>
	);
}
