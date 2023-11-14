'use client';

import { createContext, useContext, useMemo, useState } from 'react';
import type { PropsWithChildren, Dispatch, SetStateAction } from 'react';
import type { TableOfContentsSerialized } from '~/components/TableOfContentItems';

export const OutlineContext = createContext<{
	members: TableOfContentsSerialized[] | null | undefined;
	opened: boolean;
	setMembers: Dispatch<SetStateAction<TableOfContentsSerialized[] | null | undefined>>;
	setOpened: Dispatch<SetStateAction<boolean>>;
}>({ members: undefined, setMembers: (_) => {}, opened: false, setOpened: (_) => {} });

export const OutlineProvider = ({ children }: PropsWithChildren) => {
	const [members, setMembers] = useState<TableOfContentsSerialized[] | null | undefined>(undefined);
	const [opened, setOpened] = useState(false);

	const value = useMemo(() => ({ members, setMembers, opened, setOpened }), [members, opened]);

	return <OutlineContext.Provider value={value}>{children}</OutlineContext.Provider>;
};

export function useOutline() {
	return useContext(OutlineContext);
}
