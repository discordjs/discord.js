'use client';

import { isServer, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider as JotaiProvider } from 'jotai';
import { useRouter } from 'next/navigation';
import { ThemeProvider } from 'next-themes';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import type { PropsWithChildren } from 'react';
import { RouterProvider } from 'react-aria-components';
import { SidebarProvider } from '@/components/ui/Sidebar';
import { useSystemThemeFallback } from '@/hooks/useSystemThemeFallback';
import { useUnregisterServiceWorker } from '@/hooks/useUnregisterServiceWorker';

function makeQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 60 * 1_000,
			},
		},
	});
}

let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
	if (isServer) {
		// Server: always make a new query client
		return makeQueryClient();
	} else {
		browserQueryClient ??= makeQueryClient();
		return browserQueryClient;
	}
}

export function Providers({ children }: PropsWithChildren) {
	const queryClient = getQueryClient();
	const router = useRouter();
	useUnregisterServiceWorker();
	useSystemThemeFallback();

	return (
		<NuqsAdapter>
			<ThemeProvider attribute="class">
				<RouterProvider navigate={router.push}>
					<JotaiProvider>
						<QueryClientProvider client={queryClient}>
							<SidebarProvider defaultOpen>{children}</SidebarProvider>
						</QueryClientProvider>
					</JotaiProvider>
				</RouterProvider>
			</ThemeProvider>
		</NuqsAdapter>
	);
}
