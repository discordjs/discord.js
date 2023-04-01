'use client';

import { ThemeProvider } from 'next-themes';
import type { PropsWithChildren } from 'react';
import { ServiceWorker } from '~/components/ServiceWorker';
import { SystemThemeFallback } from '~/components/SystemThemeFallback';

export function Providers({ children }: PropsWithChildren) {
	return (
		<>
			<ThemeProvider attribute="class">{children}</ThemeProvider>
			<ServiceWorker />
			<SystemThemeFallback />
		</>
	);
}
