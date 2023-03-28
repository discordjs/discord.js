import type { SectionOptions } from '@discordjs/ui';
import type { PropsWithChildren } from 'react';
import { Section } from '../../Section';

export function DocumentationSection(opts: PropsWithChildren<SectionOptions & { separator?: boolean }>) {
	const { children, separator, ...props } = opts;

	return (
		<Section {...props}>
			{children}
			{separator ? <div className="border-light-900 dark:border-dark-100 mt-6 border-t-2" /> : null}
		</Section>
	);
}
