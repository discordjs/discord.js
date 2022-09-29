import type { ApiMethodJSON, ApiMethodSignatureJSON } from '@discordjs/api-extractor-utils';
import { Menu, MenuButton, MenuItem, useMenuState } from 'ariakit';
import { useCallback, useMemo, useState } from 'react';
import { FiLink } from 'react-icons/fi';
import { VscChevronDown, VscVersions } from 'react-icons/vsc';
import { HyperlinkedText } from './HyperlinkedText';
import { InheritanceText } from './InheritanceText';
import { ParameterTable } from './ParameterTable';
import { TSDoc } from './tsdoc/TSDoc';

export function MethodItem({ data }: { data: ApiMethodJSON | ApiMethodSignatureJSON }) {
	const method = data as ApiMethodJSON;
	const [overloadIndex, setOverloadIndex] = useState(1);
	const overloadedData = method.mergedSiblings[overloadIndex - 1]!;
	const menu = useMenuState({ gutter: 8, sameWidth: true, fitViewport: true });

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
					<a
						className="focus:ring-width-2 focus:ring-blurple hidden rounded outline-0 focus:ring md:inline-block"
						aria-label="Anchor"
						href={`#${key}`}
					>
						<FiLink size={20} />
					</a>
					{data.deprecated ||
					(data.kind === 'Method' && method.protected) ||
					(data.kind === 'Method' && method.static) ? (
						<div className="flex flex-row gap-1">
							{data.deprecated ? (
								<div className="flex h-5 place-content-center place-items-center rounded-full bg-red-500 px-3 text-center text-xs font-semibold uppercase text-white">
									Deprecated
								</div>
							) : null}
							{data.kind === 'Method' && method.protected ? (
								<div className="bg-blurple flex h-5 place-content-center place-items-center rounded-full px-3 text-center text-xs font-semibold uppercase text-white">
									Protected
								</div>
							) : null}
							{data.kind === 'Method' && method.static ? (
								<div className="bg-blurple flex h-5 place-content-center place-items-center rounded-full px-3 text-center text-xs font-semibold uppercase text-white">
									Static
								</div>
							) : null}
						</div>
					) : null}
					<div className="flex flex-row flex-wrap gap-1">
						<h4 className="break-all font-mono text-lg font-bold">{getShorthandName(overloadedData)}</h4>
						<h4 className="font-mono text-lg font-bold">:</h4>
						<h4 className="break-all font-mono text-lg font-bold">
							<HyperlinkedText tokens={data.returnTypeTokens} />
						</h4>
					</div>
				</div>
			</div>
			{data.mergedSiblings.length > 1 ? (
				<div className="flex flex-row place-items-center gap-2">
					<MenuButton
						state={menu}
						className="bg-light-600 hover:bg-light-700 active:bg-light-800 dark:bg-dark-600 dark:hover:bg-dark-500 dark:active:bg-dark-400 focus:ring-width-2 focus:ring-blurple rounded p-3 outline-0 focus:ring"
					>
						<div className="flex flex-row place-content-between place-items-center gap-2">
							<VscVersions size={20} />
							<div>
								<span className="font-semibold">{`Overload ${overloadIndex}`}</span>
								{` of ${data.mergedSiblings.length}`}
							</div>
							<VscChevronDown
								className={`transform transition duration-150 ease-in-out ${menu.open ? 'rotate-180' : 'rotate-0'}`}
								size={20}
							/>
						</div>
					</MenuButton>
					<Menu
						state={menu}
						className="dark:bg-dark-600 border-light-800 dark:border-dark-100 focus:ring-width-2 focus:ring-blurple z-20 flex flex-col rounded border bg-white p-1 outline-0 focus:ring"
					>
						{data.mergedSiblings.map((_, idx) => (
							<MenuItem
								key={idx}
								className="hover:bg-light-700 active:bg-light-800 dark:bg-dark-600 dark:hover:bg-dark-500 dark:active:bg-dark-400 focus:ring-width-2 focus:ring-blurple my-0.5 cursor-pointer rounded bg-white p-3 text-sm outline-0 focus:ring"
								onClick={() => setOverloadIndex(idx + 1)}
							>{`Overload ${idx + 1}`}</MenuItem>
						))}
					</Menu>
				</div>
			) : null}
			{data.summary || data.parameters.length ? (
				<div className="mb-4 flex flex-col gap-4">
					{overloadedData.deprecated ? <TSDoc node={overloadedData.deprecated} /> : null}
					{overloadedData.summary ?? data.summary ? <TSDoc node={overloadedData.summary ?? data.summary!} /> : null}
					{overloadedData.remarks ? <TSDoc node={overloadedData.remarks} /> : null}
					{overloadedData.comment ? <TSDoc node={overloadedData.comment} /> : null}
					{overloadedData.parameters.length ? <ParameterTable data={overloadedData.parameters} /> : null}
					{data.inheritanceData ? <InheritanceText data={data.inheritanceData} /> : null}
				</div>
			) : null}
		</div>
	);
}
