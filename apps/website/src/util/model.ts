import type { ApiEntryPoint, ApiItem, ApiModel } from '@microsoft/api-extractor-model';

export function findMemberByKey(model: ApiModel, packageName: string, containerKey: string) {
	const pkg = model.tryGetPackageByName(`@discordjs/${packageName}`)!;
	return (pkg.members[0] as ApiEntryPoint).tryGetMemberByKey(containerKey);
}

export function findMember(model: ApiModel, packageName: string, memberName: string | undefined): ApiItem | undefined {
	if (!memberName) {
		return undefined;
	}

	const pkg = model.tryGetPackageByName(`@discordjs/${packageName}`)!;
	return pkg.entryPoints[0]?.findMembersByName(memberName)[0];
}
