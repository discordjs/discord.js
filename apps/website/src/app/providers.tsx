'use client';

import { Provider as JotaiProvider } from 'jotai';
import { useRouter } from 'next/navigation';
import { ThemeProvider } from 'next-themes';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import type { PropsWithChildren } from 'react';
import { RouterProvider } from 'react-aria-components';
import { SidebarProvider } from '@/components/ui/Sidebar';
import { useSystemThemeFallback } from '@/hooks/useSystemThemeFallback';
import { useUnregisterServiceWorker } from '@/hooks/useUnregisterServiceWorker';

export function Providers({ children }: PropsWithChildren) {
	const router = useRouter();
	useUnregisterServiceWorker();
	useSystemThemeFallback();

	return (
		<NuqsAdapter>
			<ThemeProvider attribute="class">
				<RouterProvider navigate={router.push}>
					<JotaiProvider>
						<SidebarProvider defaultOpen>{children}</SidebarProvider>
					</JotaiProvider>
				</RouterProvider>
			</ThemeProvider>
		</NuqsAdapter>
	);
}
