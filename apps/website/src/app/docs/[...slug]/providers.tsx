'use client';

// import { ThemeProvider } from 'next-themes';
import type { PropsWithChildren } from 'react';
import { CmdKProvider } from '~/contexts/cmdK';
import { NavProvider } from '~/contexts/nav';

export function Providers({ children }: PropsWithChildren) {
	return (
		<NavProvider>
			<CmdKProvider>
				{/* <ThemeProvider
					attribute="class"
					cookieName="theme"
					defaultTheme="system"
					disableTransitionOnChange
					value={{
						light: 'light',
						dark: 'dark',
					}}
				> */}
				{children}
				{/* </ThemeProvider> */}
			</CmdKProvider>
		</NavProvider>
	);
}
