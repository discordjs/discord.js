import type { ApiItemJSON } from '@discordjs/api-extractor-utils';
import { createContext, useContext, type ReactNode } from 'react';

export const MemberContext = createContext<ApiItemJSON | undefined>(undefined);

export const MemberProvider = ({ member, children }: { member: ApiItemJSON | undefined; children: ReactNode }) => (
	<MemberContext.Provider value={member}>{children}</MemberContext.Provider>
);

export function useMember() {
	return useContext(MemberContext);
}
