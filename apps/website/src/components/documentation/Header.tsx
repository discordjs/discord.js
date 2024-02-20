import { ApiItemKind } from '@discordjs/api-extractor-model';
import { VscSymbolClass } from '@react-icons/all-files/vsc/VscSymbolClass';
import { VscSymbolEnum } from '@react-icons/all-files/vsc/VscSymbolEnum';
import { VscSymbolInterface } from '@react-icons/all-files/vsc/VscSymbolInterface';
import { VscSymbolMethod } from '@react-icons/all-files/vsc/VscSymbolMethod';
import { VscSymbolVariable } from '@react-icons/all-files/vsc/VscSymbolVariable';
import type { PropsWithChildren } from 'react';
import { SourceLink } from './SourceLink';

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
		case ApiItemKind.Variable:
			return <VscSymbolVariable />;
		default:
			return <VscSymbolMethod />;
	}
}

export function Header({
	kind,
	name,
	sourceURL,
	sourceLine,
}: PropsWithChildren<{
	readonly kind: ApiItemKind;
	readonly name: string;
	readonly sourceLine?: number | undefined;
	readonly sourceURL?: string | undefined;
}>) {
	return (
		<div className="flex flex-col">
			<h2 className="flex flex-row place-items-center justify-between gap-2 break-all text-2xl font-bold">
				<span className="row flex flex place-items-center gap-2">
					<span>{generateIcon(kind)}</span>
					{name}
				</span>
				{sourceURL ? <SourceLink sourceLine={sourceLine} sourceURL={sourceURL} /> : null}
			</h2>
		</div>
	);
}
