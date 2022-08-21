import { createContext } from 'react';
import type { ApiItemJSON } from '~/DocModel/ApiNodeJSONEncoder';

export const MemberContext = createContext<ApiItemJSON | undefined>(undefined);

export const MemberProvider = ({
	member,
	children,
}: {
	member: ApiItemJSON | undefined;
	children: React.ReactNode;
}) => <MemberContext.Provider value={member}>{children}</MemberContext.Provider>;
