import { ApiPackage } from '@discordjs/api-extractor-model';
import type { ApiModel } from '@discordjs/api-extractor-model';

export const addPackageToModel = (model: ApiModel, data: any) => {
	const apiPackage = ApiPackage.loadFromJson(data);

	model.addMember(apiPackage);
	return model;
};
