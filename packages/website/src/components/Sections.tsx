import type {
	ApiClassJSON,
	ApiInterfaceJSON,
	ParameterDocumentation,
	ApiConstructorJSON,
} from '@discordjs/api-extractor-utils';
import { useMemo } from 'react';
import { VscSymbolConstant, VscSymbolMethod, VscSymbolProperty } from 'react-icons/vsc';
import { useMedia } from 'react-use';
import { MethodList } from './MethodList';
import { ParameterTable } from './ParameterTable';
import { PropertyList } from './PropertyList';
import { Section } from './Section';
import { TSDoc } from './tsdoc/TSDoc';

export function PropertiesSection({ data }: { data: ApiClassJSON['properties'] | ApiInterfaceJSON['properties'] }) {
	const matches = useMedia('(max-width: 768px)', true);

	return data.length ? (
		<Section title="Properties" icon={<VscSymbolProperty size={20} />} padded dense={matches}>
			<PropertyList data={data} />
		</Section>
	) : null;
}

export function MethodsSection({ data }: { data: ApiClassJSON['methods'] | ApiInterfaceJSON['methods'] }) {
	const matches = useMedia('(max-width: 768px)', true);

	return data.length ? (
		<Section title="Methods" icon={<VscSymbolMethod size={20} />} padded dense={matches}>
			<MethodList data={data} />
		</Section>
	) : null;
}

export function ParametersSection({ data }: { data: ParameterDocumentation[] }) {
	const matches = useMedia('(max-width: 768px)', true);

	return data.length ? (
		<Section title="Parameters" icon={<VscSymbolConstant size={20} />} padded dense={matches}>
			<ParameterTable data={data} />
		</Section>
	) : null;
}

export function ConstructorSection({ data }: { data: ApiConstructorJSON }) {
	const matches = useMedia('(max-width: 768px)', true);

	const getShorthandName = useMemo(
		() =>
			`constructor(${data.parameters.reduce((prev, cur, index) => {
				if (index === 0) {
					return `${prev}${cur.isOptional ? `${cur.name}?` : cur.name}`;
				}

				return `${prev}, ${cur.isOptional ? `${cur.name}?` : cur.name}`;
			}, '')})`,
		[data.parameters],
	);

	return data.parameters.length ? (
		<Section title="Constructor" icon={<VscSymbolMethod size={20} />} padded dense={matches}>
			<div id={data.name} className="scroll-mt-30 flex flex-col gap-4">
				<div className="flex flex-col">
					<div className="flex flex-col gap-2 md:flex-row md:place-items-center">
						{data.deprecated || data.protected ? (
							<div className="flex flex-row gap-1">
								{data.deprecated ? (
									<div className="h-5 place-content-center rounded-full bg-red-500 px-3 text-center text-xs font-semibold uppercase text-white">
										Deprecated
									</div>
								) : null}
								{data.protected ? (
									<div className="bg-blurple h-5 place-content-center rounded-full px-3 text-center text-xs font-semibold uppercase text-white">
										Protected
									</div>
								) : null}
							</div>
						) : null}
						<h4 className="break-all font-mono text-lg font-bold">{getShorthandName}</h4>
					</div>
				</div>
				{data.summary || data.parameters.length ? (
					<div className="mb-4 flex flex-col gap-4">
						{data.deprecated ? <TSDoc node={data.deprecated} /> : null}
						{data.summary ? <TSDoc node={data.summary} /> : null}
						{data.remarks ? <TSDoc node={data.remarks} /> : null}
						{data.comment ? <TSDoc node={data.comment} /> : null}
						{data.parameters.length ? <ParameterTable data={data.parameters} /> : null}
					</div>
				) : null}
			</div>
		</Section>
	) : null;
}
