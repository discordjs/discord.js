import type { MarkdownHeading } from 'astro';

export function Outline({ headings, className }: { className?: string; headings: MarkdownHeading[] }) {
	return (
		<div className={`flex flex-col space-y-2 ${className}`}>
			{headings.map((heading) => (
				<div key={heading.slug} style={{ marginLeft: `${heading.depth * 20}px` }}>
					<a className="text-black" href={`#${heading.slug}`}>
						{heading.text}
					</a>
				</div>
			))}
		</div>
	);
}
