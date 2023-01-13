'use client';

import { useDialogState } from 'ariakit/dialog';
import type { DisclosureState } from 'ariakit/disclosure';
import { type PropsWithChildren, createContext, useContext } from 'react';

export const CmdKContext = createContext<DisclosureState | null>(null);

export const CmdKProvider = ({ children }: PropsWithChildren) => {
	const dialog = useDialogState();

	return <CmdKContext.Provider value={dialog}>{children}</CmdKContext.Provider>;
};

export function useCmdK() {
	return useContext(CmdKContext);
}
