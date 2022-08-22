import type { ApiEntryPoint, ApiModel } from '@microsoft/api-extractor-model';
import { findPackage } from './parse.server';
import { ApiNodeJSONEncoder } from '~/DocModel/ApiNodeJSONEncoder';

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
): ReturnType<typeof ApiNodeJSONEncoder['encode']> | undefined {
	if (!memberName) {
		return undefined;
	}

	const pkg = findPackage(model, packageName)!;
	const member = (pkg.members[0] as ApiEntryPoint).findMembersByName(memberName)[0];

	if (!member) {
		return undefined;
	}

	return ApiNodeJSONEncoder.encode(model, member, version);
}
