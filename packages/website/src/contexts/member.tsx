import { createContext, useContext, type ReactNode } from 'react';
import type { ApiItemJSON } from '~/DocModel/ApiNodeJSONEncoder';

export const MemberContext = createContext<ApiItemJSON | undefined>(undefined);

export const MemberProvider = ({ member, children }: { member: ApiItemJSON | undefined; children: ReactNode }) => (
	<MemberContext.Provider value={member}>{children}</MemberContext.Provider>
);

export function useMember() {
	return useContext(MemberContext);
}
