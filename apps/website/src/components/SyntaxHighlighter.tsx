import { getHighlighterCore } from 'shiki/core';
import getWasm from 'shiki/wasm';

const highlighter = await getHighlighterCore({
	themes: [import('shiki/themes/github-light.mjs'), import('shiki/themes/github-dark-dimmed.mjs')],
	langs: [import('shiki/langs/typescript.mjs'), import('shiki/langs/javascript.mjs')],
	loadWasm: getWasm,
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
