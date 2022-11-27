'use client';

import type { ApiItemJSON } from '@discordjs/api-extractor-utils';
import { createContext, useContext, type ReactNode } from 'react';

export const MemberContext = createContext<ApiItemJSON | undefined>(undefined);

export const MemberProvider = ({
	member,
	children,
}: {
	children?: ReactNode | undefined;
	member: ApiItemJSON | undefined;
}) => <MemberContext.Provider value={member}>{children}</MemberContext.Provider>;

export function useMember() {
	return useContext(MemberContext);
}
