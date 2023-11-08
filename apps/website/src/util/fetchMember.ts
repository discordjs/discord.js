import { ApiModel, ApiFunction } from '@discordjs/api-extractor-model';
import { fetchModelJSON } from '~/app/docAPI';
import { addPackageToModel } from './addPackageToModel';
import { OVERLOAD_SEPARATOR, PACKAGES } from './constants';
import { findMember, findMemberByKey } from './model';

export interface ItemRouteParams {
	item: string;
	package: string;
	version: string;
}

export async function fetchMember({ package: packageName, version: branchName = 'main', item }: ItemRouteParams) {
	if (!PACKAGES.includes(packageName)) {
		return null;
	}

	const model = new ApiModel();

	if (branchName === 'main') {
		const modelJSONFiles = await Promise.all(PACKAGES.map(async (pkg) => fetchModelJSON(pkg, branchName)));

		for (const modelJSONFile of modelJSONFiles) {
			if (!modelJSONFile) {
				continue;
			}

			addPackageToModel(model, modelJSONFile);
		}
	} else {
		const modelJSON = await fetchModelJSON(packageName, branchName);

		if (!modelJSON) {
			return null;
		}

		addPackageToModel(model, modelJSON);
	}

	const [memberName, overloadIndex] = decodeURIComponent(item).split(OVERLOAD_SEPARATOR);

	// eslint-disable-next-line prefer-const
	let { containerKey, displayName: name } = findMember(model, packageName, memberName) ?? {};
	if (name && overloadIndex && !Number.isNaN(Number.parseInt(overloadIndex, 10))) {
		containerKey = ApiFunction.getContainerKey(name, Number.parseInt(overloadIndex, 10));
	}

	return memberName && containerKey ? findMemberByKey(model, packageName, containerKey) ?? null : null;
}
