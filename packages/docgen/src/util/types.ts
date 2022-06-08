/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import type { JSONOutput } from 'typedoc';

interface QueryType {
	type: 'query';
	queryType: JSONOutput.SomeType;
}

export function isArrayType(value: any): value is JSONOutput.ArrayType {
	return typeof value == 'object' && value.type === 'array';
}

export function isConditionalType(value: any): value is JSONOutput.ConditionalType {
	return typeof value == 'object' && value.type === 'conditional';
}

export function isIndexedAccessType(value: any): value is JSONOutput.IndexedAccessType {
	return typeof value == 'object' && value.type === 'indexedAccess';
}

export function isInferredType(value: any): value is JSONOutput.InferredType {
	return typeof value == 'object' && value.type === 'inferred';
}

export function isIntersectionType(value: any): value is JSONOutput.IntersectionType {
	return typeof value == 'object' && value.type === 'intersection';
}

export function isIntrinsicType(value: any): value is JSONOutput.IntrinsicType {
	return typeof value == 'object' && value.type === 'intrinsic';
}

export function isPredicateType(value: any): value is JSONOutput.PredicateType {
	return typeof value == 'object' && value.type === 'predicate';
}

export function isReferenceType(value: any): value is JSONOutput.ReferenceType {
	return typeof value == 'object' && value.type === 'reference';
}

export function isReflectionType(value: any): value is JSONOutput.ReflectionType {
	return typeof value == 'object' && value.type === 'reflection';
}

export function isLiteralType(value: any): value is JSONOutput.LiteralType {
	return typeof value == 'object' && value.type === 'literal';
}

export function isTupleType(value: any): value is JSONOutput.TupleType {
	return typeof value == 'object' && value.type === 'tuple';
}

export function isTypeOperatorType(value: any): value is JSONOutput.TypeOperatorType {
	return typeof value == 'object' && value.type === 'typeOperator';
}

export function isUnionType(value: any): value is JSONOutput.UnionType {
	return typeof value == 'object' && value.type === 'union';
}

export function isUnknownType(value: any): value is JSONOutput.UnknownType {
	return typeof value == 'object' && value.type === 'unknown';
}

export function isQueryType(value: any): value is QueryType {
	return typeof value == 'object' && value.type === 'query';
}
