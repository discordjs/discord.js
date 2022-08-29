/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { ApiModel, ApiItem, type ApiPackage } from '@microsoft/api-extractor-model';
import { TSDocConfiguration } from '@microsoft/tsdoc';
import { TSDocConfigFile } from '@microsoft/tsdoc-config';

export function createApiModel(data: any) {
	const model = new ApiModel();
	const tsdocConfiguration = new TSDocConfiguration();
	const tsdocConfigFile = TSDocConfigFile.loadFromObject(data.metadata.tsdocConfig);
	tsdocConfigFile.configureParser(tsdocConfiguration);

	// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
	const apiPackage = ApiItem.deserialize(data, {
		apiJsonFilename: '',
		toolPackage: data.metadata.toolPackage,
		toolVersion: data.metadata.toolVersion,
		versionToDeserialize: data.metadata.schemaVersion,
		tsdocConfiguration,
	}) as ApiPackage;
	model.addMember(apiPackage);
	return model;
}
