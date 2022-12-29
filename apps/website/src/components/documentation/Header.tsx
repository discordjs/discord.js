'use server';

import type { ApiClass, ApiItem } from '@microsoft/api-extractor-model';
import { ApiItemKind } from '@microsoft/api-extractor-model';
import { VscSymbolClass } from '@react-icons/all-files/vsc/VscSymbolClass';
import { VscSymbolEnum } from '@react-icons/all-files/vsc/VscSymbolEnum';
import { VscSymbolInterface } from '@react-icons/all-files/vsc/VscSymbolInterface';
import { VscSymbolMethod } from '@react-icons/all-files/vsc/VscSymbolMethod';
import { VscSymbolVariable } from '@react-icons/all-files/vsc/VscSymbolVariable';
import type { PropsWithChildren } from 'react';
import { ExtendsText } from './ExtendsText';

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

function HeaderBody({ item }: { item: ApiItem }) {
	switch (item.kind) {
		case ApiItemKind.Class:
			return <ExtendsText item={item as ApiClass} />;
		case ApiItemKind.Function:
			return null;
		case ApiItemKind.Method:
			return null;
		case ApiItemKind.Enum:
			return null;
		case ApiItemKind.Interface:
			return null;
		case ApiItemKind.TypeAlias:
			return null;
		default:
			return null;
	}
}

export function Header({ item, subheading, children }: PropsWithChildren<{ item: ApiItem; subheading?: string }>) {
	return (
		<div className="flex flex-col gap-4">
			<h2 className="flex flex-row place-items-center gap-2 break-all text-2xl font-bold">
				<span>{generateIcon(item.kind)}</span>
				{item.displayName}
			</h2>
			{subheading}
			<HeaderBody item={item} />
			{children}
		</div>
	);
}
