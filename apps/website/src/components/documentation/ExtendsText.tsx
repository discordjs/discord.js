import { type ApiClass, ApiItemKind } from '@microsoft/api-extractor-model';
import { ExcerptText } from '../ExcerptText';

export function ExtendsText({ item }: { item: ApiClass }) {
	if (item.kind === ApiItemKind.Class && !(item as ApiClass).extendsType) {
		return null;
	}

	const model = item.getAssociatedModel()!;

	if (!item.extendsType) {
		return null;
	}

	return (
		<div className="flex flex-row place-items-center gap-4">
			<h3 className="text-xl font-bold">Extends</h3>
			<span className="break-all font-mono">
				<ExcerptText excerpt={item.extendsType.excerpt} model={model} />
			</span>
		</div>
	);
}
