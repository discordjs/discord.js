import { ApiModel, ApiFunction, ApiPackage } from '@discordjs/api-extractor-model';
import { fetchModelJSON } from '~/app/docAPI';
import { OVERLOAD_SEPARATOR, PACKAGES } from './constants';
import { findMember, findMemberByKey } from './model';

export const fetchMember = async (packageName: string, branchName: string, item?: string) => {
	if (!PACKAGES.includes(packageName)) {
		return null;
	}

	if (!item) {
		return null;
	}

	const model = new ApiModel();

	const modelJSON = await fetchModelJSON(packageName, branchName);

	if (!modelJSON) {
		return null;
	}

	model.addMember(ApiPackage.loadFromJson(modelJSON));

	const [memberName, overloadIndex] = decodeURIComponent(item).split(OVERLOAD_SEPARATOR);

	// eslint-disable-next-line prefer-const
	let { containerKey, displayName: name } = findMember(model, packageName, memberName) ?? {};
	if (name && overloadIndex && !Number.isNaN(Number.parseInt(overloadIndex, 10))) {
		containerKey = ApiFunction.getContainerKey(name, Number.parseInt(overloadIndex, 10));
	}

	return memberName && containerKey ? findMemberByKey(model, packageName, containerKey) ?? null : null;
};
