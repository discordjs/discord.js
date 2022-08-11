import {
	ApiClass,
	ApiDeclaredItem,
	ApiEntryPoint,
	ApiEnum,
	ApiFunction,
	ApiInterface,
	ApiItem,
	ApiItemKind,
	ApiModel,
	ApiTypeAlias,
	ApiVariable,
} from '@microsoft/api-extractor-model';
import { findPackage } from './parse.server';
import { DocClass } from '../DocModel/DocClass';
import { DocEnum } from '../DocModel/DocEnum';
import { DocFunction } from '../DocModel/DocFunction';
import { DocInterface } from '../DocModel/DocInterface';
import { DocItem } from '../DocModel/DocItem';
import { DocTypeAlias } from '../DocModel/DocTypeAlias';
import { DocVariable } from '../DocModel/DocVariable';

export interface ReferenceData {
	name: string;
	path: string;
}

function createDocItem(model: ApiModel, member: ApiItem) {
	if (!(member instanceof ApiDeclaredItem)) {
		return undefined;
	}

	switch (member.kind) {
		case ApiItemKind.Class:
			return new DocClass(model, member as ApiClass);
		case ApiItemKind.Function:
			return new DocFunction(model, member as ApiFunction);
		case ApiItemKind.Interface:
			return new DocInterface(model, member as ApiInterface);
		case ApiItemKind.TypeAlias:
			return new DocTypeAlias(model, member as ApiTypeAlias);
		case ApiItemKind.Variable:
			return new DocVariable(model, member as ApiVariable);
		case ApiItemKind.Enum:
			return new DocEnum(model, member as ApiEnum);
		default:
			return new DocItem(model, member);
	}
}

export function findMemberByKey(model: ApiModel, packageName: string, containerKey: string) {
	const pkg = findPackage(model, packageName)!;
	const member = (pkg.members[0] as ApiEntryPoint).tryGetMemberByKey(containerKey);

	if (!member) {
		return undefined;
	}

	return createDocItem(model, member);
}

export function findMember(model: ApiModel, packageName: string, memberName: string): DocItem | undefined {
	const pkg = findPackage(model, packageName)!;
	const member = (pkg.members[0] as ApiEntryPoint).findMembersByName(memberName)[0];

	if (!member) {
		return undefined;
	}

	return createDocItem(model, member);
}
