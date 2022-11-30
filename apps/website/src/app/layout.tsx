import { ServerThemeProvider } from 'next-themes';
import type { PropsWithChildren } from 'react';

import '@unocss/reset/tailwind.css';
import '../styles/inter.css';
import '../styles/unocss.css';
import '../styles/cmdk.css';
import '../styles/main.css';

export default function RootLayout({ children }: PropsWithChildren) {
	return (
		<ServerThemeProvider
			attribute="class"
			defaultTheme="system"
			disableTransitionOnChange
			value={{
				light: 'light',
				dark: 'dark',
			}}
		>
			<html lang="en">
				<head />
				<body className="dark:bg-dark-800 bg-white">{children}</body>
			</html>
		</ServerThemeProvider>
	);
}
