import type { ApiModel, ApiPackage } from '@discordjs/api-extractor-model';
import { ApiItem } from '@discordjs/api-extractor-model';
import { TSDocConfiguration } from '@microsoft/tsdoc';
import { TSDocConfigFile } from '@microsoft/tsdoc-config';

export const addPackageToModel = (model: ApiModel, data: any) => {
	let apiPackage: ApiPackage;
	if (data.metadata) {
		const tsdocConfiguration = new TSDocConfiguration();
		const tsdocConfigFile = TSDocConfigFile.loadFromObject(data.metadata.tsdocConfig);
		tsdocConfigFile.configureParser(tsdocConfiguration);

		apiPackage = ApiItem.deserialize(data, {
			apiJsonFilename: '',
			toolPackage: data.metadata.toolPackage,
			toolVersion: data.metadata.toolVersion,
			versionToDeserialize: data.metadata.schemaVersion,
			tsdocConfiguration,
		}) as ApiPackage;
	} else {
		apiPackage = ApiItem.deserializeDocgen(data, 'discord.js') as ApiPackage;
	}

	model.addMember(apiPackage);
	return model;
};
