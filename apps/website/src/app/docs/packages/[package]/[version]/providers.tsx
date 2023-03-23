'use client';

import type { PropsWithChildren } from 'react';
import { CmdKProvider } from '~/contexts/cmdK';
import { NavProvider } from '~/contexts/nav';

export function Providers({ children }: PropsWithChildren) {
	return (
		<NavProvider>
			<CmdKProvider>{children}</CmdKProvider>
		</NavProvider>
	);
}
