import type { ApiClass, ApiInterface, Excerpt } from '@discordjs/api-extractor-model';
import { ApiItemKind } from '@discordjs/api-extractor-model';
import { ExcerptText } from '../ExcerptText';

export function HierarchyText({
	item,
	type,
}: {
	readonly item: ApiClass | ApiInterface;
	readonly type: 'Extends' | 'Implements';
}) {
	if (
		(item.kind === ApiItemKind.Class &&
			(item as ApiClass).extendsType === undefined &&
			(item as ApiClass).implementsTypes.length === 0) ||
		(item.kind === ApiItemKind.Interface && !(item as ApiInterface).extendsTypes)
	) {
		return null;
	}

	let excerpts: Excerpt[];

	if (item.kind === ApiItemKind.Class) {
		if (type === 'Implements') {
			if ((item as ApiClass).implementsTypes.length === 0) {
				return null;
			}

			excerpts = (item as ApiClass).implementsTypes.map((typeExcerpt) => typeExcerpt.excerpt);
		} else {
			if (!(item as ApiClass).extendsType) {
				return null;
			}

			excerpts = [(item as ApiClass).extendsType!.excerpt];
		}
	} else {
		if ((item as ApiInterface).extendsTypes.length === 0) {
			return null;
		}

		excerpts = (item as ApiInterface).extendsTypes.map((typeExcerpt) => typeExcerpt.excerpt);
	}

	return (
		<div className="flex flex-col gap-4">
			{excerpts.map((excerpt, idx) => (
				<div className="flex flex-row place-items-center gap-4" key={`${type}-${idx}`}>
					<h3 className="text-xl font-bold">{type}</h3>
					<span className="break-all font-mono space-y-2">
						<ExcerptText excerpt={excerpt} apiPackage={item.getAssociatedPackage()!} />
					</span>
				</div>
			))}
		</div>
	);
}
