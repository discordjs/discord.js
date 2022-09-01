import type { JSONOutput } from 'typedoc';
import {
	isArrayType,
	isConditionalType,
	isIndexedAccessType,
	isIntersectionType,
	isPredicateType,
	isReferenceType,
	isReflectionType,
	isLiteralType,
	isTupleType,
	isTypeOperatorType,
	isUnionType,
	isQueryType,
	isInferredType,
	isIntrinsicType,
	isUnknownType,
} from './types.js';

export function parseType(someType: JSONOutput.SomeType | JSONOutput.Type | string): string {
	if (typeof someType === 'string') {
		return someType;
	}

	if (isArrayType(someType)) {
		return `Array<${parseType(someType.elementType)}>`;
	}

	if (isConditionalType(someType)) {
		const { checkType, extendsType, trueType, falseType } = someType;
		return `${parseType(checkType)} extends ${parseType(extendsType)} ? ${parseType(trueType)} : ${parseType(
			falseType,
		)}`;
	}

	if (isIndexedAccessType(someType)) {
		return `${parseType(someType.objectType)}[${parseType(someType.indexType)}]`;
	}

	if (isIntersectionType(someType)) {
		return someType.types.map(parseType).join(' & ');
	}

	if (isPredicateType(someType)) {
		return (
			(someType.asserts ? 'asserts ' : '') +
			someType.name +
			(someType.targetType ? ` is ${parseType(someType.targetType)}` : '')
		);
	}

	if (isReferenceType(someType)) {
		return someType.name + (someType.typeArguments ? `<${someType.typeArguments.map(parseType).join(', ')}>` : '');
	}

	if (isReflectionType(someType)) {
		const obj: Record<string, any> = {};

		const { children, signatures } = someType.declaration!;

		// This is run when we're parsing interface-like declaration
		if (children && children.length > 0) {
			for (const child of children) {
				const { type } = child;
				if (type) {
					obj[child.name] = parseType(type);
				}
			}

			return `{\n${Object.entries(obj)
				.map(([key, value]) => `${key}: ${value as string}`)
				.join(',\n')}\n}`;
		}

		// This is run if we're parsing a function type
		if (signatures && signatures.length > 0) {
			const signature = signatures[0];
			const params = signature?.parameters?.map(
				(param) => `${param.name}: ${param.type ? parseType(param.type) : 'unknown'}`,
			);
			return `(${params?.join(', ') ?? '...args: unknown[]'}) => ${
				signature?.type ? parseType(signature.type) : 'unknown'
			}`;
		}

		return '{}';
	}

	if (isLiteralType(someType)) {
		if (typeof someType.value === 'string') {
			return `'${someType.value}'`;
		}

		// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
		return `${someType.value}`;
	}

	if (isTupleType(someType)) {
		return `[${(someType.elements ?? []).map(parseType).join(', ')}]`;
	}

	if (isTypeOperatorType(someType)) {
		return `${someType.operator} ${parseType(someType.target)}`;
	}

	if (isUnionType(someType)) {
		return someType.types
			.map(parseType)
			.filter((currentType) => Boolean(currentType) && currentType.trim().length > 0)
			.join(' | ');
	}

	if (isQueryType(someType)) {
		return `(typeof ${parseType(someType.queryType)})`;
	}

	if (isInferredType(someType) || isIntrinsicType(someType) || isUnknownType(someType)) {
		return someType.name;
	}

	return 'unknown';
}
