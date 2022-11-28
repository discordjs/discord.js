'use client';

import type { TokenDocumentation, ApiItemJSON, AnyDocNodeJSON, InheritanceData } from '@discordjs/api-extractor-utils';
import { FiLink } from '@react-icons/all-files/fi/FiLink';
import type { PropsWithChildren } from 'react';
import { HyperlinkedText } from './HyperlinkedText';
import { InheritanceText } from './InheritanceText';
import { TSDoc } from './tsdoc/TSDoc';

export enum CodeListingSeparatorType {
	Type = ':',
	Value = '=',
}

export function CodeListing({
	name,
	separator = CodeListingSeparatorType.Type,
	typeTokens,
	readonly = false,
	optional = false,
	summary,
	children,
	comment,
	deprecation,
	inheritanceData,
}: PropsWithChildren<{
	comment?: AnyDocNodeJSON | null;
	deprecation?: AnyDocNodeJSON | null;
	inheritanceData?: InheritanceData | null;
	name: string;
	optional?: boolean;
	readonly?: boolean;
	separator?: CodeListingSeparatorType;
	summary?: ApiItemJSON['summary'];
	typeTokens: TokenDocumentation[];
}>) {
	return (
		<div className="scroll-mt-30 flex flex-col gap-4" id={name}>
			<div className="md:-ml-8.5 flex flex-col gap-2 md:flex-row md:place-items-center">
				<a
					aria-label="Anchor"
					className="focus:ring-width-2 focus:ring-blurple hidden rounded outline-0 focus:ring md:inline-block"
					href={`#${name}`}
				>
					<FiLink size={20} />
				</a>
				{deprecation || readonly || optional ? (
					<div className="flex flex-row gap-1">
						{deprecation ? (
							<div className="flex h-5 flex-row place-content-center place-items-center rounded-full bg-red-500 px-3 text-center text-xs font-semibold uppercase text-white">
								Deprecated
							</div>
						) : null}
						{readonly ? (
							<div className="bg-blurple flex h-5 flex-row place-content-center place-items-center rounded-full px-3 text-center text-xs font-semibold uppercase text-white">
								Readonly
							</div>
						) : null}
						{optional ? (
							<div className="bg-blurple flex h-5 flex-row place-content-center place-items-center rounded-full px-3 text-center text-xs font-semibold uppercase text-white">
								Optional
							</div>
						) : null}
					</div>
				) : null}
				<div className="flex flex-row flex-wrap place-items-center gap-1">
					<h4 className="break-all font-mono text-lg font-bold">
						{name}
						{optional ? '?' : ''}
					</h4>
					<h4 className="font-mono text-lg font-bold">{separator}</h4>
					<h4 className="break-all font-mono text-lg font-bold">
						<HyperlinkedText tokens={typeTokens} />
					</h4>
				</div>
			</div>
			{summary || inheritanceData ? (
				<div className="mb-4 flex flex-col gap-4">
					{deprecation ? <TSDoc node={deprecation} /> : null}
					{summary ? <TSDoc node={summary} /> : null}
					{comment ? <TSDoc node={comment} /> : null}
					{inheritanceData ? <InheritanceText data={inheritanceData} /> : null}
					{children}
				</div>
			) : null}
		</div>
	);
}
