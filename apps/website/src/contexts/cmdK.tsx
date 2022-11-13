import { type DisclosureState, useDialogState } from 'ariakit';
import type { PropsWithChildren } from 'react';
import { createContext, useContext } from 'react';

export const CmdKContext = createContext<DisclosureState | null>(null);

export const CmdKProvider = ({ children }: PropsWithChildren) => {
	const dialog = useDialogState();

	return <CmdKContext.Provider value={dialog}>{children}</CmdKContext.Provider>;
};

export function useCmdK() {
	return useContext(CmdKContext);
}
