'use client';

import { createContext, useContext, useMemo, useState } from 'react';
import type { PropsWithChildren, Dispatch, SetStateAction } from 'react';
import type { TableOfContentsSerialized } from '~/components/TableOfContentItems';

export const OutlineContext = createContext<{
	members: TableOfContentsSerialized[] | null | undefined;
	setMembers: Dispatch<SetStateAction<TableOfContentsSerialized[] | null | undefined>>;
}>({ members: undefined, setMembers: (_) => {} });

export const OutlineProvider = ({ children }: PropsWithChildren) => {
	const [members, setMembers] = useState<TableOfContentsSerialized[] | null | undefined>(undefined);

	const value = useMemo(() => ({ members, setMembers }), [members]);

	return <OutlineContext.Provider value={value}>{children}</OutlineContext.Provider>;
};

export function useOutline() {
	return useContext(OutlineContext);
}
