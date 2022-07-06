import type { ApiMethodSignature, ApiModel } from '@microsoft/api-extractor-model';
import { DocFunction } from './DocFunction';

export class DocMethodSignature extends DocFunction {
	public readonly optional: boolean;

	public constructor(model: ApiModel, item: ApiMethodSignature) {
		super(model, item);
		this.optional = item.isOptional;
	}

	public override toJSON() {
		return {
			...super.toJSON(),
			optional: this.optional,
		};
	}
}
