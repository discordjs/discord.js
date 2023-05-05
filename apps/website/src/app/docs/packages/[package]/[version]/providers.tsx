'use client';

import type { PropsWithChildren } from 'react';
import { CmdKProvider } from '~/contexts/cmdK';
import { MemberProvider } from '~/contexts/member';
import { NavProvider } from '~/contexts/nav';

export function Providers({ children }: PropsWithChildren) {
	return (
		<NavProvider>
			<MemberProvider>
				<CmdKProvider>{children}</CmdKProvider>
			</MemberProvider>
		</NavProvider>
	);
}
