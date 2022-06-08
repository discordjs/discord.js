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
} from './types';

export function parseType(t: JSONOutput.SomeType | JSONOutput.Type | string): string {
	if (typeof t === 'string') {
		return t;
	}

	if (isArrayType(t)) {
		return `Array<${parseType(t.elementType)}>`;
	}

	if (isConditionalType(t)) {
		const { checkType, extendsType, trueType, falseType } = t;
		return `${parseType(checkType)} extends ${parseType(extendsType)} ? ${parseType(trueType)} : ${parseType(
			falseType,
		)}`;
	}

	if (isIndexedAccessType(t)) {
		return `${parseType(t.objectType)}[${parseType(t.indexType)}]`;
	}

	if (isIntersectionType(t)) {
		return t.types.map(parseType).join(' & ');
	}

	if (isPredicateType(t)) {
		return (t.asserts ? 'asserts ' : '') + t.name + (t.targetType ? ` is ${parseType(t.targetType)}` : '');
	}

	if (isReferenceType(t)) {
		return t.name + (t.typeArguments ? `<${t.typeArguments.map(parseType).join(', ')}>` : '');
	}

	if (isReflectionType(t)) {
		const obj: Record<string, any> = {};

		const { children, signatures } = t.declaration!;

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
			const s = signatures[0];
			const params = s?.parameters?.map((p) => `${p.name}: ${p.type ? parseType(p.type) : 'unknown'}`);
			return `(${params?.join(', ') ?? '...args: unknown[]'}) => ${s?.type ? parseType(s.type) : 'unknown'}`;
		}

		return '{}';
	}

	if (isLiteralType(t)) {
		if (typeof t.value == 'string') {
			return `'${t.value}'`;
		}
		// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
		return `${t.value}`;
	}

	if (isTupleType(t)) {
		return `[${(t.elements ?? []).map(parseType).join(', ')}]`;
	}

	if (isTypeOperatorType(t)) {
		return `${t.operator} ${parseType(t.target)}`;
	}

	if (isUnionType(t)) {
		return t.types
			.map(parseType)
			.filter((s) => Boolean(s) && s.trim().length > 0)
			.join(' | ');
	}

	if (isQueryType(t)) {
		return `(typeof ${parseType(t.queryType)})`;
	}

	if (isInferredType(t) || isIntrinsicType(t) || isUnknownType(t)) {
		return t.name;
	}

	return 'unknown';
}
