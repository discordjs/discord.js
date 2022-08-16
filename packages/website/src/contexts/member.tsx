import { createContext } from 'react';
import type { DocItem } from '~/DocModel/DocItem';

export type DocItemJSON = ReturnType<DocItem['toJSON']>;

export const MemberContext = createContext<DocItemJSON | undefined>(undefined);

export const MemberProvider = ({
	member,
	children,
}: {
	member: DocItemJSON | undefined;
	children: React.ReactNode;
}) => <MemberContext.Provider value={member}>{children}</MemberContext.Provider>;
