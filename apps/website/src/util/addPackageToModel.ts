import type { ApiModel, ApiPackage } from '@microsoft/api-extractor-model';
import { ApiItem } from '@microsoft/api-extractor-model';
import { TSDocConfiguration } from '@microsoft/tsdoc';
import { TSDocConfigFile } from '@microsoft/tsdoc-config';

export function addPackageToModel(model: ApiModel, data: any) {
	const tsdocConfiguration = new TSDocConfiguration();
	const tsdocConfigFile = TSDocConfigFile.loadFromObject(data.metadata.tsdocConfig);
	tsdocConfigFile.configureParser(tsdocConfiguration);

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
