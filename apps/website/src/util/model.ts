import type {
	ApiDocumentedItem,
	ApiEntryPoint,
	ApiModel,
	ApiParameterListMixin,
	Excerpt,
} from '@microsoft/api-extractor-model';
import type { DocSection } from '@microsoft/tsdoc';

export function findMemberByKey(model: ApiModel, packageName: string, containerKey: string) {
	const pkg = model.tryGetPackageByName(`@discordjs/${packageName}`)!;
	return (pkg.members[0] as ApiEntryPoint).tryGetMemberByKey(containerKey);
}

export function findMember(model: ApiModel, packageName: string, memberName: string | undefined) {
	if (!memberName) {
		return undefined;
	}

	const pkg = model.tryGetPackageByName(`@discordjs/${packageName}`)!;
	return pkg.entryPoints[0]?.findMembersByName(memberName)[0];
}

interface ResolvedParameter {
	description?: DocSection | undefined;
	isOptional: boolean;
	name: string;
	parameterTypeExcerpt: Excerpt;
}

/**
 * This takes an api item with a parameter list and resolves the names and descriptions of all the parameters.
 *
 * @remarks
 * This is different from accessing `Parameter#name` or `Parameter.tsdocBlockComment` as this method cross-references the associated tsdoc
 * parameter names and descriptions and uses them as a higher precedence to the source code.
 *
 * @param item - The api item to resolve parameter data for
 *
 * @returns An array of parameters
 */
export function resolveParameters(item: ApiDocumentedItem & ApiParameterListMixin): ResolvedParameter[] {
	return item.parameters.map((param, idx) => {
		const tsdocAnalog = item.tsdocComment?.params.blocks[idx];

		return {
			name: param.tsdocParamBlock?.parameterName ?? tsdocAnalog?.parameterName ?? param.name,
			description: param.tsdocParamBlock?.content ?? tsdocAnalog?.content,
			isOptional: param.isOptional,
			parameterTypeExcerpt: param.parameterTypeExcerpt,
		};
	});
}
