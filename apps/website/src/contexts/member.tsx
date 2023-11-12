'use client';

import type { ApiItem } from '@discordjs/api-extractor-model';
import type { ApiItemJSON } from '@discordjs/api-extractor-utils';
import { createContext, useContext, useMemo, useState } from 'react';
import type { PropsWithChildren, Dispatch, SetStateAction } from 'react';

export const MemberContext = createContext<{
	member: ApiItem | ApiItemJSON | null | undefined;
	setMember: Dispatch<SetStateAction<ApiItem | ApiItemJSON | null | undefined>>;
}>({ member: undefined, setMember: (_) => {} });

export const MemberProvider = ({ children }: PropsWithChildren) => {
	const [member, setMember] = useState<ApiItem | ApiItemJSON | null | undefined>(undefined);
	const value = useMemo(() => ({ member, setMember }), [member]);

	return <MemberContext.Provider value={value}>{children}</MemberContext.Provider>;
};

export function useMember() {
	return useContext(MemberContext);
}
