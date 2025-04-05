import { createHighlighterCore } from 'shiki/core';
import { createOnigurumaEngine } from 'shiki/engine/oniguruma';

const highlighter = await createHighlighterCore({
	themes: [import('shiki/themes/github-light.mjs'), import('shiki/themes/github-dark-dimmed.mjs')],
	langs: [
		import('shiki/langs/typescript.mjs'),
		import('shiki/langs/javascript.mjs'),
		import('shiki/langs/shellscript.mjs'),
	],
	engine: createOnigurumaEngine(async () => import('shiki/wasm')),
});

export async function SyntaxHighlighter({
	lang,
	code,
	className = '',
}: {
	readonly className?: string;
	readonly code: string;
	readonly lang: string;
}) {
	const codeHTML = highlighter.codeToHtml(code.trim(), {
		lang,
		themes: {
			light: 'github-light',
			dark: 'github-dark-dimmed',
		},
	});

	return (
		<>
			{/* eslint-disable-next-line react/no-danger */}
			<div className={className} dangerouslySetInnerHTML={{ __html: codeHTML }} />
		</>
	);
}
