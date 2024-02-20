'use client';

import { useEffect, type PropsWithChildren } from 'react';
import { useOutline } from '~/contexts/outline';
import type { TableOfContentsSerialized } from '../TableOfContentItems';

export function OutlineSetter({ members }: PropsWithChildren<{ readonly members: TableOfContentsSerialized[] }>) {
	const { setMembers } = useOutline();

	useEffect(() => {
		setMembers(members);

		return () => {
			setMembers(null);
		};
	}, [members, setMembers]);

	return null;
}
