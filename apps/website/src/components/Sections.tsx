'use server';

// import type {
// 	ApiClassJSON,
// 	ApiInterfaceJSON,
// 	ParameterDocumentation,
// 	ApiConstructorJSON,
// } from '@discordjs/api-extractor-utils';
// import { Section } from '@discordjs/ui';
// import type { ApiItem, ApiItemContainerMixin } from '@microsoft/api-extractor-model';
// import { VscSymbolConstant } from '@react-icons/all-files/vsc/VscSymbolConstant';
// import { VscSymbolMethod } from '@react-icons/all-files/vsc/VscSymbolMethod';
// import { VscSymbolProperty } from '@react-icons/all-files/vsc/VscSymbolProperty';
// import { useMemo } from 'react';
// import { useMedia } from 'react-use';
// import { MethodList } from './MethodList';
// import { ParameterTable } from './ParameterTable';
// import { PropertyList } from './PropertyList';
// import { TSDoc } from './documentation/tsdoc/TSDoc';

export {};

// export function PropertiesSection({ item }: { item: ApiItemContainerMixin }) {
// 	const matches = useMedia('(max-width: 768px)', true);

// 	return item.members.length ? (
// 		<Section dense={matches} icon={<VscSymbolProperty size={20} />} padded title="Properties">
// 			<PropertyList item={item} />
// 		</Section>
// 	) : null;
// }

// export function MethodsSection({ data }: { data: ApiClassJSON['methods'] | ApiInterfaceJSON['methods'] }) {
// 	const matches = useMedia('(max-width: 768px)', true);

// 	return data.length ? (
// 		<Section dense={matches} icon={<VscSymbolMethod size={20} />} padded title="Methods">
// 			<MethodList data={data} />
// 		</Section>
// 	) : null;
// }

// export function ParametersSection({ data }: { data: ParameterDocumentation[] }) {
// 	const matches = useMedia('(max-width: 768px)', true);

// 	return data.length ? (
// 		<Section dense={matches} icon={<VscSymbolConstant size={20} />} padded title="Parameters">
// 			<ParameterTable data={data} />
// 		</Section>
// 	) : null;
// }

// export function ConstructorSection({ data }: { data: ApiConstructorJSON }) {
// 	const matches = useMedia('(max-width: 768px)', true);

// 	const getShorthandName = useMemo(
// 		() =>
// 			`constructor(${data.parameters.reduce((prev, cur, index) => {
// 				if (index === 0) {
// 					return `${prev}${cur.isOptional ? `${cur.name}?` : cur.name}`;
// 				}

// 				return `${prev}, ${cur.isOptional ? `${cur.name}?` : cur.name}`;
// 			}, '')})`,
// 		[data.parameters],
// 	);

// 	return data.parameters.length ? (
// 		<Section dense={matches} icon={<VscSymbolMethod size={20} />} padded title="Constructor">
// 			<div className="scroll-mt-30 flex flex-col gap-4" id={data.name}>
// 				<div className="flex flex-col">
// 					<div className="flex flex-col gap-2 md:flex-row md:place-items-center">
// 						{data.deprecated || data.protected ? (
// 							<div className="flex flex-row gap-1">
// 								{data.deprecated ? (
// 									<div className="flex h-5 flex-row place-content-center place-items-center rounded-full bg-red-500 px-3 text-center text-xs font-semibold uppercase text-white">
// 										Deprecated
// 									</div>
// 								) : null}
// 								{data.protected ? (
// 									<div className="bg-blurple flex h-5 flex-row place-content-center place-items-center rounded-full px-3 text-center text-xs font-semibold uppercase text-white">
// 										Protected
// 									</div>
// 								) : null}
// 							</div>
// 						) : null}
// 						<h4 className="break-all font-mono text-lg font-bold">{getShorthandName}</h4>
// 					</div>
// 				</div>
// 				{data.summary || data.parameters.length ? (
// 					<div className="mb-4 flex flex-col gap-4">
// 						{data.deprecated ? <TSDoc tsdoc={data.deprecated} /> : null}
// 						{data.summary ? <TSDoc tsdoc={data.summary} /> : null}
// 						{data.remarks ? <TSDoc tsdoc={data.remarks} /> : null}
// 						{data.comment ? <TSDoc tsdoc={data.comment} /> : null}
// 						{data.parameters.length ? <ParameterTable data={data.parameters} /> : null}
// 					</div>
// 				) : null}
// 			</div>
// 		</Section>
// 	) : null;
// }
