import type { ApiDocumentedItem } from '@microsoft/api-extractor-model';
import { ApiAbstractMixin, ApiProtectedMixin, ApiReadonlyMixin, ApiStaticMixin } from '@microsoft/api-extractor-model';
import type { ReactNode } from 'react';

const mappedBadgeColors = {
	danger: 'bg-red-500',
	warning: 'bg-yellow-500',
	primary: 'bg-blurple',
} as const;

export type BadgeColor = keyof typeof mappedBadgeColors;

export interface BadgeProps {
	/**
	 * The content of the badge.
	 */
	children?: ReactNode | undefined;
	/**
	 * The color of the badge.
	 *
	 * @defaultValue "primary"
	 */
	color?: BadgeColor;
}

export function Badge({ children, color = 'primary' }: BadgeProps) {
	return (
		<span
			className={`h-5 flex flex-row place-content-center place-items-center rounded-full px-3 text-center text-xs font-semibold uppercase text-white ${mappedBadgeColors[color]}`}
		>
			{children}
		</span>
	);
}

export function Badges({ item }: { item: ApiDocumentedItem }) {
	const isStatic = ApiStaticMixin.isBaseClassOf(item) && item.isStatic;
	const isProtected = ApiProtectedMixin.isBaseClassOf(item) && item.isProtected;
	const isReadonly = ApiReadonlyMixin.isBaseClassOf(item) && item.isReadonly;
	const isAbstract = ApiAbstractMixin.isBaseClassOf(item) && item.isAbstract;
	const isDeprecated = Boolean(item.tsdocComment?.deprecatedBlock);

	return (
		<div className="flex flex-row gap-1 md:ml-7">
			{isDeprecated ? <Badge color="danger">Deprecated</Badge> : null}
			{isProtected ? <Badge>Protected</Badge> : null}
			{isStatic ? <Badge>Static</Badge> : null}
			{isAbstract ? <Badge>Abstract</Badge> : null}
			{isReadonly ? <Badge>Readonly</Badge> : null}
		</div>
	);
}
