import type { PropsWithChildren } from 'react';
import { Providers } from './providers';
import { inter } from '~/util/fonts';

import '@unocss/reset/tailwind-compat.css';
import '../styles/unocss.css';
import '../styles/cmdk.css';
import '../styles/main.css';

export default function RootLayout({ children }: PropsWithChildren) {
	return (
		<html className={inter.variable} lang="en" suppressHydrationWarning>
			<body className="dark:bg-dark-800 bg-white">
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
