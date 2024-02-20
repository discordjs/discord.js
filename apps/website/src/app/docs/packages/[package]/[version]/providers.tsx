'use client';

import type { PropsWithChildren } from 'react';
import { CmdKProvider } from '~/contexts/cmdK';
import { MemberProvider } from '~/contexts/member';
import { NavProvider } from '~/contexts/nav';
import { OutlineProvider } from '~/contexts/outline';

export function Providers({ children }: PropsWithChildren) {
	return (
		<NavProvider>
			<OutlineProvider>
				<MemberProvider>
					<CmdKProvider>{children}</CmdKProvider>
				</MemberProvider>
			</OutlineProvider>
		</NavProvider>
	);
}
