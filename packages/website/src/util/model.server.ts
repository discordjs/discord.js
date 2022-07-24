import {
	ApiClass,
	ApiDeclaredItem,
	ApiEntryPoint,
	ApiEnum,
	ApiFunction,
	ApiInterface,
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

export function findMember(model: ApiModel, packageName: string, memberName: string): DocItem | undefined {
	const pkg = findPackage(model, packageName)!;
	const member = (pkg.members[0] as ApiEntryPoint).findMembersByName(memberName)[0];

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

	// return {
	// 	name: resolveName(member),
	// 	kind: member.kind,
	// 	summary: resolveDocComment(member),
	// 	excerpt: member.excerpt.text,
	// 	tokens: member.excerpt.spannedTokens.map((token) => genToken(model, token)),
	// 	refs: [...findReferences(model, member.excerpt).values()].map(genReference),
	// 	members: getProperties(member).map((member) => ({
	// 		tokens: member.excerpt.spannedTokens.map((token) => genToken(model, token)),
	// 		summary: resolveDocComment(member),
	// 	})),
	// 	parameters: member instanceof ApiFunction ? member.parameters.map((param) => genParameter(model, param)) : [],
	// 	foo: excerpt.spannedTokens.map((token) => genToken(model, token)),
	// };
}
