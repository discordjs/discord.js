'use server';

import { ApiItemKind } from '@microsoft/api-extractor-model';
import { VscSymbolClass } from '@react-icons/all-files/vsc/VscSymbolClass';
import { VscSymbolEnum } from '@react-icons/all-files/vsc/VscSymbolEnum';
import { VscSymbolInterface } from '@react-icons/all-files/vsc/VscSymbolInterface';
import { VscSymbolMethod } from '@react-icons/all-files/vsc/VscSymbolMethod';
import { VscSymbolVariable } from '@react-icons/all-files/vsc/VscSymbolVariable';
import type { PropsWithChildren } from 'react';

function generateIcon(kind: ApiItemKind) {
	switch (kind) {
		case ApiItemKind.Class:
			return <VscSymbolClass />;
		case ApiItemKind.Function:
		case ApiItemKind.Method:
			return <VscSymbolMethod />;
		case ApiItemKind.Enum:
			return <VscSymbolEnum />;
		case ApiItemKind.Interface:
			return <VscSymbolInterface />;
		case ApiItemKind.TypeAlias:
			return <VscSymbolVariable />;
		default:
			return <VscSymbolMethod />;
	}
}

export function Header({ kind, name }: PropsWithChildren<{ kind: ApiItemKind; name: string }>) {
	return (
		<div className="flex flex-col gap-4">
			<h2 className="flex flex-row place-items-center gap-2 break-all text-2xl font-bold">
				<span>{generateIcon(kind)}</span>
				{name}
			</h2>
		</div>
	);
}
