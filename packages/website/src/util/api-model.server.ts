/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ApiItem, ApiModel, type ApiPackage } from '~/util/api-extractor.server';
import { TSDocConfigFile } from '~/util/tsdoc-config.server';
import { TSDocConfiguration } from '~/util/tsdoc.server';

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
