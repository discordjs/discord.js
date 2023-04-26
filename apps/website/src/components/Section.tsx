'use client';

import { Section as DJSSection, type SectionOptions } from '@discordjs/ui';
import type { PropsWithChildren } from 'react';

export function Section(options: PropsWithChildren<SectionOptions>) {
	return <DJSSection {...options} />;
}
