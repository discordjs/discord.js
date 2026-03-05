import { AlertTriangle } from 'lucide-react';
import type { PropsWithChildren } from 'react';

export function Badge({ children, className = '' }: PropsWithChildren<{ readonly className?: string }>) {
	return (
		<span
			className={`inline-flex place-items-center gap-1 rounded-full px-2 py-1 font-sans text-sm leading-none font-normal whitespace-nowrap ${className}`}
		>
			{children}
		</span>
	);
}

export async function Badges({ node }: { readonly node: any }) {
	const isDeprecated = Boolean(node.summary?.deprecatedBlock?.length);
	const isUnstable = Boolean(node.summary?.unstableBlock?.length);
	const isProtected = node.isProtected;
	const isStatic = node.isStatic;
	const isAbstract = node.isAbstract;
	const isReadonly = node.isReadonly;
	const isOptional = node.isOptional;
	const isExternal = node.isExternal;

	const isAny =
		isDeprecated || isUnstable || isProtected || isStatic || isAbstract || isReadonly || isOptional || isExternal;

	return isAny ? (
		<div className="mb-1 flex flex-wrap gap-3">
			{isDeprecated ? (
				<Badge className="bg-red-500/20 text-red-500">
					<AlertTriangle aria-hidden size={14} /> deprecated
				</Badge>
			) : null}
			{isUnstable ? (
				<Badge className="bg-red-500/20 text-red-500">
					<AlertTriangle aria-hidden size={14} /> unstable
				</Badge>
			) : null}
			{isProtected ? <Badge className="bg-purple-500/20 text-purple-500">protected</Badge> : null}
			{isStatic ? <Badge className="bg-purple-500/20 text-purple-500">static</Badge> : null}
			{isAbstract ? <Badge className="bg-cyan-500/20 text-cyan-500">abstract</Badge> : null}
			{isReadonly ? <Badge className="bg-purple-500/20 text-purple-500">readonly</Badge> : null}
			{isOptional ? <Badge className="bg-cyan-500/20 text-cyan-500">optional</Badge> : null}
			{isExternal ? <Badge className="bg-purple-500/20 text-purple-500">external</Badge> : null}
		</div>
	) : null;
}
