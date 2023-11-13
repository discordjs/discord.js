import type { ApiDocumentedItem } from '@discordjs/api-extractor-model';
import { ApiAbstractMixin, ApiProtectedMixin, ApiReadonlyMixin, ApiStaticMixin } from '@discordjs/api-extractor-model';
import type { PropsWithChildren } from 'react';

export enum BadgeColor {
	Danger = 'bg-red-500',
	Primary = 'bg-blurple',
	Warning = 'bg-yellow-500',
}

export function Badge({
	children,
	color = BadgeColor.Primary,
}: PropsWithChildren<{ readonly color?: BadgeColor | undefined }>) {
	return (
		<span
			className={`h-5 flex flex-row place-content-center place-items-center rounded-full px-3 text-center text-xs font-semibold uppercase text-white ${color}`}
		>
			{children}
		</span>
	);
}

export function Badges({ item }: { readonly item: ApiDocumentedItem }) {
	const isStatic = ApiStaticMixin.isBaseClassOf(item) && item.isStatic;
	const isProtected = ApiProtectedMixin.isBaseClassOf(item) && item.isProtected;
	const isReadonly = ApiReadonlyMixin.isBaseClassOf(item) && item.isReadonly;
	const isAbstract = ApiAbstractMixin.isBaseClassOf(item) && item.isAbstract;
	const isDeprecated = Boolean(item.tsdocComment?.deprecatedBlock);

	const isAny = isStatic || isProtected || isReadonly || isAbstract || isDeprecated;

	return isAny ? (
		<div className="flex flex-row gap-1 md:ml-7">
			{isDeprecated ? <Badge color={BadgeColor.Danger}>Deprecated</Badge> : null}
			{isProtected ? <Badge>Protected</Badge> : null}
			{isStatic ? <Badge>Static</Badge> : null}
			{isAbstract ? <Badge>Abstract</Badge> : null}
			{isReadonly ? <Badge>Readonly</Badge> : null}
		</div>
	) : null;
}
