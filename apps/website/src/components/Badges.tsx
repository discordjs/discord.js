import { AlertTriangle } from 'lucide-react';
import type { PropsWithChildren } from 'react';

export function Badge({ children, className = '' }: PropsWithChildren<{ readonly className?: string }>) {
	return (
		<span
			className={`inline-flex place-items-center gap-1 rounded-full px-2 py-1 font-sans text-sm font-normal leading-none ${className}`}
		>
			{children}
		</span>
	);
}

export async function Badges({ node }: { readonly node: any }) {
	const isDeprecated = Boolean(node.summary?.deprecatedBlock?.length);
	const isProtected = node.isProtected;
	const isStatic = node.isStatic;
	const isAbstract = node.isAbstract;
	const isReadonly = node.isReadonly;
	const isOptional = node.isOptional;

	const isAny = isDeprecated || isProtected || isStatic || isAbstract || isReadonly || isOptional;

	return isAny ? (
		<div className="mb-1 flex gap-3">
			{isDeprecated ? (
				<Badge className="bg-red-500/20 text-red-500">
					<AlertTriangle aria-hidden size={14} /> deprecated
				</Badge>
			) : null}
			{isProtected ? <Badge className="bg-purple-500/20 text-purple-500">protected</Badge> : null}
			{isStatic ? <Badge className="bg-purple-500/20 text-purple-500">static</Badge> : null}
			{isAbstract ? <Badge className="bg-cyan-500/20 text-cyan-500">abstract</Badge> : null}
			{isReadonly ? <Badge className="bg-purple-500/20 text-purple-500">readonly</Badge> : null}
			{isOptional ? <Badge className="bg-cyan-500/20 text-cyan-500">optional</Badge> : null}
		</div>
	) : null;
}
