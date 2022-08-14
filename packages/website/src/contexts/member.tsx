import { createContext } from 'react';
import type { DocItem } from '~/DocModel/DocItem';

export type DocItemJSON = ReturnType<DocItem['toJSON']>;

export const MemberContext = createContext<DocItemJSON | undefined>(undefined);

export interface MemberProviderProps {
	member: DocItemJSON | undefined;
	children: React.ReactNode;
}

export const MemberProvider = ({ member, children }: MemberProviderProps) => (
	<MemberContext.Provider value={member}>{children}</MemberContext.Provider>
);
