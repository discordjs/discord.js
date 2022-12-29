import { findPackage, ApiNodeJSONEncoder } from '@discordjs/api-extractor-utils';
import type { ApiEntryPoint, ApiItem, ApiModel } from '@microsoft/api-extractor-model';

export function findMemberByKey(model: ApiModel, packageName: string, containerKey: string, version: string) {
	const pkg = findPackage(model, packageName)!;
	const member = (pkg.members[0] as ApiEntryPoint).tryGetMemberByKey(containerKey);

	if (!member) {
		return undefined;
	}

	return ApiNodeJSONEncoder.encode(model, member, version);
}

export function findMember(
	model: ApiModel,
	packageName: string,
	memberName: string | undefined,
	version: string,
): ApiItem | undefined {
	if (!memberName) {
		return undefined;
	}

	const pkg = findPackage(model, packageName)!;
	return (pkg.members[0] as ApiEntryPoint).findMembersByName(memberName)[0];
}
