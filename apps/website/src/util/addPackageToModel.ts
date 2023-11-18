import { type ApiModel, ApiPackage } from '@discordjs/api-extractor-model';

export const addPackageToModel = (model: ApiModel, data: any) => {
	model.addMember(ApiPackage.loadFromJson(data));
	return model;
};
