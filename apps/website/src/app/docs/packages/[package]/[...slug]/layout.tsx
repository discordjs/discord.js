import type { PropsWithChildren } from 'react';
import { Providers } from './providers';
import { CmdKDialog } from '~/components/CmdK';
import { Header } from '~/components/Header';

export default function SidebarLayout({ children }: PropsWithChildren) {
	return (
		<Providers>
			<Header />
			<>{children}</>
			<CmdKDialog />
		</Providers>
	);
}
