import { codeToHtml } from '@/util/shiki.bundle';

export async function SyntaxHighlighter({
	lang,
	code,
	className = '',
}: {
	readonly className?: string;
	readonly code: string;
	readonly lang: string;
}) {
	const codeHTML = await codeToHtml(code.trim(), {
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
