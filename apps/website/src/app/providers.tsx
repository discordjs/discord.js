'use client';

import { ThemeProvider } from 'next-themes';
import type { PropsWithChildren } from 'react';
import { useSystemThemeFallback } from '~/hooks/useSystemThemeFallback';
import { useUnregisterServiceWorker } from '~/hooks/useUnregisterServiceWorker';

export function Providers({ children }: PropsWithChildren) {
	useUnregisterServiceWorker();
	useSystemThemeFallback();

	return <ThemeProvider attribute="class">{children}</ThemeProvider>;
}
