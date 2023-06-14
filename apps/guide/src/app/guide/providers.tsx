'use client';

import type { PropsWithChildren } from 'react';
import { NavProvider } from '~/contexts/nav';

export function Providers({ children }: PropsWithChildren) {
	return <NavProvider>{children}</NavProvider>;
}
