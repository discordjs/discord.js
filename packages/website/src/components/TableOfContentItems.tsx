import type { ApiClassJSON, ApiInterfaceJSON } from '@discordjs/api-extractor-utils';
import { useMemo } from 'react';
import { VscListSelection, VscSymbolMethod, VscSymbolProperty } from 'react-icons/vsc';

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
					key={prop.name}
					href={`#${prop.name}`}
					className="dark:border-dark-100 border-light-800 dark:hover:bg-dark-200 dark:active:bg-dark-100 hover:bg-light-700 active:bg-light-800 ml-[10px] border-l p-[5px] pl-4"
				>
					<span className="line-clamp-1">{prop.name}</span>
				</a>
			)),
		[properties],
	);

	const methodItems = useMemo(
		() =>
			methods.map((member) => {
				const key = `${member.name}${
					member.overloadIndex && member.overloadIndex > 1 ? `:${member.overloadIndex}` : ''
				}`;

				return (
					<a
						key={key}
						href={`#${key}`}
						className="dark:border-dark-100 border-light-800 dark:hover:bg-dark-200 dark:active:bg-dark-100 hover:bg-light-700 active:bg-light-800 ml-[10px] flex flex-row place-items-center gap-2 border-l p-[5px] pl-4"
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
