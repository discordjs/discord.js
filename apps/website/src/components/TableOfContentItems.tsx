'use client';

import type { ApiClassJSON, ApiInterfaceJSON } from '@discordjs/api-extractor-utils';
import { VscListSelection } from '@react-icons/all-files/vsc/VscListSelection';
import { VscSymbolMethod } from '@react-icons/all-files/vsc/VscSymbolMethod';
import { VscSymbolProperty } from '@react-icons/all-files/vsc/VscSymbolProperty';
import { useMemo } from 'react';

export function TableOfContentItems({
	methods,
	properties,
}: {
	methods: ApiClassJSON['methods'] | ApiInterfaceJSON['methods'];
	properties: ApiClassJSON['properties'] | ApiInterfaceJSON['properties'];
}) {
	const propertyItems = useMemo(
		() =>
			properties.map((prop) => (
				<a
					className="dark:border-dark-100 border-light-800 dark:hover:bg-dark-200 dark:active:bg-dark-100 hover:bg-light-700 active:bg-light-800 pl-6.5 focus:ring-width-2 focus:ring-blurple ml-[10px] border-l p-[5px] text-sm outline-0 focus:rounded focus:border-0 focus:ring"
					href={`#${prop.name}`}
					key={prop.name}
					title={prop.name}
				>
					<span className="line-clamp-1">{prop.name}</span>
				</a>
			)),
		[properties],
	);

	const methodItems = useMemo(
		() =>
			methods.map((member) => {
				if (member.overloadIndex && member.overloadIndex > 1) {
					return null;
				}

				const key = `${member.name}${
					member.overloadIndex && member.overloadIndex > 1 ? `:${member.overloadIndex}` : ''
				}`;

				return (
					<a
						className="dark:border-dark-100 border-light-800 dark:hover:bg-dark-200 dark:active:bg-dark-100 hover:bg-light-700 active:bg-light-800 pl-6.5 focus:ring-width-2 focus:ring-blurple ml-[10px] flex flex-row place-items-center gap-2 border-l p-[5px] text-sm outline-0 focus:rounded focus:border-0 focus:ring"
						href={`#${key}`}
						key={key}
						title={member.name}
					>
						<span className="line-clamp-1">{member.name}</span>
						{member.overloadIndex && member.overloadIndex > 1 ? (
							<span className="text-xs">{member.overloadIndex}</span>
						) : null}
					</a>
				);
			}),
		[methods],
	);

	return (
		<div className="flex flex-col break-all p-3 pb-8">
			<div className="mt-4 ml-2 flex flex-row gap-2">
				<VscListSelection size={25} />
				<span className="font-semibold">Contents</span>
			</div>
			<div className="mt-5.5 ml-2 flex flex-col gap-2">
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
