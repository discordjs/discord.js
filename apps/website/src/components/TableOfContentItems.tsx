'use client';

import { VscListSelection } from '@react-icons/all-files/vsc/VscListSelection';
import { VscSymbolMethod } from '@react-icons/all-files/vsc/VscSymbolMethod';
import { VscSymbolProperty } from '@react-icons/all-files/vsc/VscSymbolProperty';
import { useMemo } from 'react';

export interface TableOfContentsSerializedMethod {
	kind: 'Method' | 'MethodSignature';
	name: string;
	overloadIndex?: number;
}

export interface TableOfContentsSerializedProperty {
	kind: 'Property' | 'PropertySignature';
	name: string;
}

export type TableOfContentsSerialized = TableOfContentsSerializedMethod | TableOfContentsSerializedProperty;

export interface TableOfContentsItemProps {
	serializedMembers: TableOfContentsSerialized[];
}

export function TableOfContentsPropertyItem({ property }: { property: TableOfContentsSerializedProperty }) {
	return (
		<a
			className="ml-[10px] border-l border-light-800 p-[5px] pl-6.5 text-sm outline-none focus:border-0 dark:border-dark-100 focus:rounded active:bg-light-800 hover:bg-light-700 focus:ring focus:ring-width-2 focus:ring-blurple dark:active:bg-dark-100 dark:hover:bg-dark-200"
			href={`#${property.name}`}
			key={`${property.name}-${property.kind}`}
			title={property.name}
		>
			<span className="line-clamp-1">{property.name}</span>
		</a>
	);
}

export function TableOfContentsMethodItem({ method }: { method: TableOfContentsSerializedMethod }) {
	if (method.overloadIndex && method.overloadIndex > 1) {
		return null;
	}

	const key = `${method.name}${method.overloadIndex && method.overloadIndex > 1 ? `:${method.overloadIndex}` : ''}`;

	return (
		<a
			className="ml-[10px] flex flex-row place-items-center gap-2 border-l border-light-800 p-[5px] pl-6.5 text-sm outline-none focus:border-0 dark:border-dark-100 focus:rounded active:bg-light-800 hover:bg-light-700 focus:ring focus:ring-width-2 focus:ring-blurple dark:active:bg-dark-100 dark:hover:bg-dark-200"
			href={`#${key}`}
			key={key}
			title={method.name}
		>
			<span className="line-clamp-1">{method.name}</span>
			{method.overloadIndex && method.overloadIndex > 1 ? (
				<span className="text-xs">{method.overloadIndex}</span>
			) : null}
		</a>
	);
}

export function TableOfContentItems({ serializedMembers }: TableOfContentsItemProps) {
	const propertyItems = useMemo(
		() =>
			serializedMembers
				.filter(
					(member): member is TableOfContentsSerializedProperty =>
						member.kind === 'Property' || member.kind === 'PropertySignature',
				)
				.map((prop, idx) => <TableOfContentsPropertyItem key={`${prop.name}-${prop.kind}-${idx}`} property={prop} />),
		[serializedMembers],
	);

	const methodItems = useMemo(
		() =>
			serializedMembers
				.filter(
					(member): member is TableOfContentsSerializedMethod =>
						member.kind === 'Method' || member.kind === 'MethodSignature',
				)
				.map((member, idx) => (
					<TableOfContentsMethodItem
						key={`${member.name}${member.overloadIndex ? `:${member.overloadIndex}` : ''}-${idx}`}
						method={member}
					/>
				)),
		[serializedMembers],
	);

	return (
		<div className="flex flex-col break-all p-3 pb-8">
			<div className="ml-2 mt-4 flex flex-row gap-2">
				<VscListSelection size={25} />
				<span className="font-semibold">Contents</span>
			</div>
			<div className="ml-2 mt-5.5 flex flex-col gap-2">
				{propertyItems.length ? (
					<div className="flex flex-col">
						<div className="flex flex-row place-items-center gap-4">
							<VscSymbolProperty size={20} />
							<div className="p-3 pl-0">
								<span className="font-semibold">Properties</span>
							</div>
						</div>
						{propertyItems}
					</div>
				) : null}
				{methodItems.length ? (
					<div className="flex flex-col">
						<div className="flex flex-row place-items-center gap-4">
							<VscSymbolMethod size={20} />
							<div className="p-3 pl-0">
								<span className="font-semibold">Methods</span>
							</div>
						</div>
						{methodItems}
					</div>
				) : null}
			</div>
		</div>
	);
}
