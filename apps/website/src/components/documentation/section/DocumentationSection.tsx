'use client';

import type { SectionOptions } from '@discordjs/ui';
import { Section } from '@discordjs/ui';
import type { PropsWithChildren } from 'react';

export function DocumentationSection(opts: PropsWithChildren<SectionOptions & { separator?: boolean }>) {
	const { children, separator, ...props } = opts;

	return (
		<Section {...props}>
			{children}
			{separator ? <div className="border-light-900 dark:border-dark-100 -mx-8 mt-6 border-t-2" /> : null}
		</Section>
	);
}
