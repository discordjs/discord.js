'use client';

import { useMenuState } from 'ariakit';
import { ReactNode, useState } from 'react';
import { Header } from '~/components/documentation/Header';

export interface FunctionBodyProps {
	mergedSiblingCount: number;
	overloadDocumentation: React.ReactNode[];
}

export function FunctionBody({ mergedSiblingCount, overloadDocumentation }: FunctionBodyProps) {
	const [overloadIndex, setOverloadIndex] = useState(1);
	const menu = useMenuState({ gutter: 8, sameWidth: true, fitViewport: true });
	const documentation = overloadDocumentation[overloadIndex - 1];

	return <>{documentation}</>;
}
