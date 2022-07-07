import type { ApiItem, ApiModel, ApiTypeParameterListMixin } from '@microsoft/api-extractor-model';
import type { DocItemConstructor } from './DocItem';
import { generateTypeParamData, TypeParameterData } from '~/util/parse.server';

export function TypeParameterMixin<TBase extends DocItemConstructor>(Base: TBase) {
	return class Mixed extends Base {
		public readonly typeParameters: TypeParameterData[] = [];

		public constructor(...args: any[]);
		public constructor(model: ApiModel, item: ApiItem) {
			super(model, item);
			this.typeParameters = (item as ApiTypeParameterListMixin).typeParameters.map((typeParam) =>
				generateTypeParamData(this.model, typeParam),
			);
		}

		public override toJSON() {
			return {
				...super.toJSON(),
				typeParameterData: this.typeParameters,
			};
		}
	};
}
