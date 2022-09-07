import type { ApiMethodJSON, ApiMethodSignatureJSON } from '@discordjs/api-extractor-utils';
import { useCallback, useMemo } from 'react';
import { FiLink } from 'react-icons/fi';
import { HyperlinkedText } from './HyperlinkedText';
import { InheritanceText } from './InheritanceText';
import { ParameterTable } from './ParameterTable';
import { TSDoc } from './tsdoc/TSDoc';

export function MethodItem({ data }: { data: ApiMethodJSON | ApiMethodSignatureJSON }) {
	const method = data as ApiMethodJSON;
	const key = useMemo(
		() => `${data.name}${data.overloadIndex && data.overloadIndex > 1 ? `:${data.overloadIndex}` : ''}`,
		[data.name, data.overloadIndex],
	);

	const getShorthandName = useCallback(
		(data: ApiMethodJSON | ApiMethodSignatureJSON) =>
			`${data.name}${data.optional ? '?' : ''}(${data.parameters.reduce((prev, cur, index) => {
				if (index === 0) {
					return `${prev}${cur.isOptional ? `${cur.name}?` : cur.name}`;
				}

				return `${prev}, ${cur.isOptional ? `${cur.name}?` : cur.name}`;
			}, '')})`,
		[],
	);

	return (
		<div id={key} className="scroll-mt-30 flex flex-col gap-4">
			<div className="flex flex-col">
				<div className="flex flex-col gap-2 md:-ml-9 md:flex-row md:place-items-center">
					<a className="hidden md:inline-block" aria-label="Anchor" href={`#${key}`}>
						<FiLink size={20} />
					</a>
					{data.deprecated ||
					(data.kind === 'Method' && method.protected) ||
					(data.kind === 'Method' && method.static) ? (
						<div className="flex flex-row gap-1">
							{data.deprecated ? (
								<div className="h-5 place-content-center rounded-full bg-red-500 px-3 text-center text-xs font-semibold uppercase text-white">
									Deprecated
								</div>
							) : null}
							{data.kind === 'Method' && method.protected ? (
								<div className="bg-blurple h-5 place-content-center rounded-full px-3 text-center text-xs font-semibold uppercase text-white">
									Protected
								</div>
							) : null}
							{data.kind === 'Method' && method.static ? (
								<div className="bg-blurple h-5 place-content-center rounded-full px-3 text-center text-xs font-semibold uppercase text-white">
									Static
								</div>
							) : null}
						</div>
					) : null}
					<div className="flex flex-row flex-wrap gap-1">
						<h4 className="break-all font-mono text-lg font-bold">{getShorthandName(data)}</h4>
						<h4 className="font-mono text-lg font-bold">:</h4>
						<h4 className="break-all font-mono text-lg font-bold">
							<HyperlinkedText tokens={data.returnTypeTokens} />
						</h4>
					</div>
				</div>
			</div>
			{data.summary || data.parameters.length ? (
				<div className="mb-4 flex flex-col gap-4">
					{data.deprecated ? <TSDoc node={data.deprecated} /> : null}
					{data.summary ? <TSDoc node={data.summary} /> : null}
					{data.remarks ? <TSDoc node={data.remarks} /> : null}
					{data.comment ? <TSDoc node={data.comment} /> : null}
					{data.parameters.length ? <ParameterTable data={data.parameters} /> : null}
					{data.inheritanceData ? <InheritanceText data={data.inheritanceData} /> : null}
				</div>
			) : null}
		</div>
	);
}
