'use client';

import { Provider as JotaiProvider } from 'jotai';
import { useRouter } from 'next/navigation';
import { ThemeProvider } from 'next-themes';
import type { PropsWithChildren } from 'react';
import { RouterProvider } from 'react-aria-components';
import { useSystemThemeFallback } from '~/hooks/useSystemThemeFallback';
import { useUnregisterServiceWorker } from '~/hooks/useUnregisterServiceWorker';

export function Providers({ children }: PropsWithChildren) {
	const router = useRouter();
	useUnregisterServiceWorker();
	useSystemThemeFallback();

	return (
		// eslint-disable-next-line @typescript-eslint/unbound-method
		<RouterProvider navigate={router.push}>
			<JotaiProvider>
				<ThemeProvider attribute="class">{children}</ThemeProvider>
			</JotaiProvider>
		</RouterProvider>
	);
}
