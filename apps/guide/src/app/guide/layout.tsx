import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { ReactNode } from 'react';
import { baseOptions } from '@/app/layout.config';
import { source } from '@/lib/source';

export default function Layout({ children }: { readonly children: ReactNode }) {
	return (
		<DocsLayout
			sidebar={{
				tabs: {
					transform(option, node) {
						const meta = source.getNodeMeta(node);
						if (!meta || !node.icon) return option;

						// category selection color based on path src/styles/base.css
						const color = `var(--${meta.file.path.split('/')[0]}-color, var(--color-fd-foreground))`;

						return {
							...option,
							icon: (
								<div
									className="rounded-lg border p-1.5 shadow-lg md:mb-auto md:rounded-md md:p-1 [&_svg]:size-6 md:[&_svg]:size-5"
									style={{
										color,
										backgroundColor: `color-mix(in oklab, ${color} 10%, transparent)`,
									}}
								>
									{node.icon}
								</div>
							),
						};
					},
				},
			}}
			tree={source.pageTree}
			{...baseOptions}
		>
			{children}
		</DocsLayout>
	);
}
