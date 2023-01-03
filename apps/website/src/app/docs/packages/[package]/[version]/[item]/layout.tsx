import type { PropsWithChildren } from 'react';
import { Providers } from './providers';
import { CmdKDialog } from '~/components/CmdK';

export default function ItemLayout({ children }: PropsWithChildren) {
	return (
		<Providers>
			<>{children}</>
			<CmdKDialog />
		</Providers>
	);
}
