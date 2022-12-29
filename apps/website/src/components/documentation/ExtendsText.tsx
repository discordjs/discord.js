import { genToken } from '@discordjs/api-extractor-utils';
import { type ApiClass, ApiItemKind } from '@microsoft/api-extractor-model';
import { HyperlinkedText } from '../HyperlinkedText';

export function ExtendsText({ item }: { item: ApiClass }) {
	if (item.kind === ApiItemKind.Class && !(item as ApiClass).extendsType) {
		return null;
	}

	const model = item.getAssociatedModel()!;
	const extendsTokens =
		(item as ApiClass).extendsType?.excerpt.spannedTokens.map((token) => genToken(model, token, ' ')) ?? [];

	return (
		<div className="flex flex-row place-items-center gap-4">
			<h3 className="text-xl font-bold">Extends</h3>
			<span className="break-all font-mono">
				<HyperlinkedText tokens={extendsTokens} />
			</span>
		</div>
	);
}
