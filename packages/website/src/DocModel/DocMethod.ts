import type { ApiMethod, ApiModel } from '@microsoft/api-extractor-model';
import { DocFunction } from './DocFunction';
import { Visibility } from './Visibility';
import { generatePath } from '~/util/parse.server';

export interface InheritanceData {
	parentName: string;
	path: string;
}

export class DocMethod extends DocFunction {
	public readonly static: boolean;
	public readonly optional: boolean;
	public readonly visibility: Visibility;
	public readonly inheritanceData: InheritanceData | null;

	public constructor(model: ApiModel, item: ApiMethod, inherited = false) {
		super(model, item);
		this.static = item.isStatic;
		this.optional = item.isOptional;
		this.visibility = item.isProtected ? Visibility.Protected : Visibility.Public;
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
			static: this.static,
			optional: this.optional,
			visibility: this.visibility,
			inheritanceData: this.inheritanceData,
		};
	}
}
