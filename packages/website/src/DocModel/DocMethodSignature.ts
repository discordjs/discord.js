import type { ApiMethodSignature, ApiModel } from '@microsoft/api-extractor-model';
import { DocFunction } from './DocFunction';
import type { InheritanceData } from './DocMethod';
import { generatePath } from '~/util/parse.server';

export class DocMethodSignature extends DocFunction {
	public readonly optional: boolean;
	public readonly inheritanceData: InheritanceData | null;

	public constructor(model: ApiModel, item: ApiMethodSignature, inherited = false) {
		super(model, item);
		this.optional = item.isOptional;
		this.inheritanceData =
			inherited && item.parent
				? {
						parentName: item.parent.displayName,
						path: generatePath(item.parent.getHierarchy()),
				  }
				: null;
	}

	public override toJSON() {
		return {
			...super.toJSON(),
			optional: this.optional,
			inheritanceData: this.inheritanceData,
		};
	}
}
