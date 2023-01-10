'use client';

import type { SectionOptions } from '@discordjs/ui';
import { Section } from '@discordjs/ui';
import type { PropsWithChildren } from 'react';
import { useMedia } from 'react-use';

export function ResponsiveSection(opts: PropsWithChildren<SectionOptions & { separator?: boolean }>) {
	const matches = useMedia('(max-width: 768px)', true);

	const { children, separator, ...rest } = opts;

	const props = {
		...rest,
		dense: matches,
	};

	return (
		<Section {...props}>
			{children}
			{separator ? <div className="border-light-900 dark:border-dark-100 -mx-8 mt-6 border-t-2" /> : null}
		</Section>
	);
}
