import { generatePath } from '@discordjs/api-extractor-utils';
import { tryResolveSummaryText } from '@discordjs/scripts';
import type { ApiClass, ApiDeclaredItem, ApiItemContainerMixin } from '@microsoft/api-extractor-model';
import { ExcerptTokenKind } from '@microsoft/api-extractor-model';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { memberPredicate } from '~/components/documentation/util';
import { fetchMember } from '~/util/fetchMember';
import { resolveMembers } from '~/util/members';

export const revalidate = 3_600;

export async function GET(_: NextRequest, { params }: { params: { item: string; package: string; version: string } }) {
	const member = await fetchMember({
		package: params.package,
		version: params.version,
		item: params.item,
	});

	if (!member) {
		return new Response(null, { status: 404 });
	}

	const model = member.getAssociatedModel();
	const excerpt = (member as ApiClass).extendsType?.excerpt;

	return NextResponse.json({
		name: member.displayName,
		kind: member.kind,
		extendsFrom:
			excerpt?.spannedTokens
				.map((token) => {
					if (token.kind === ExcerptTokenKind.Reference) {
						const referenceItem = member
							.getAssociatedModel()
							?.resolveDeclarationReference(token.canonicalReference!, model).resolvedApiItem;

						if (referenceItem) {
							return {
								name: referenceItem.displayName,
								kind: referenceItem.kind,
								summary: tryResolveSummaryText(referenceItem as unknown as ApiDeclaredItem) ?? '',
								path: generatePath(referenceItem.getHierarchy(), params.version),
							};
						}
					}

					return null;
				})
				.filter(Boolean) ?? null,
		summary: tryResolveSummaryText(member as ApiDeclaredItem) ?? '',
		path: generatePath(member.getHierarchy(), params.version),
		members: resolveMembers(member as ApiItemContainerMixin, memberPredicate).map((member) => {
			const isDeprecated = Boolean(member.item.tsdocComment?.deprecatedBlock);

			return {
				inheritedFrom: member.inherited
					? {
							name: member.inherited.displayName,
							kind: member.inherited.kind,
							summary: tryResolveSummaryText(member.inherited as unknown as ApiDeclaredItem) ?? '',
							path: generatePath(member.inherited.getHierarchy(), params.version),
					  }
					: null,
				name: member.item.displayName,
				kind: member.item.kind,
				deprecated: isDeprecated,
				// @ts-expect-error: Typings
				readonly: member.item.isReadonly ?? false,
				optional: member.item.isOptional,
				// @ts-expect-error: Typings
				static: member.item.isStatic ?? false,
				// @ts-expect-error: Typings
				protected: member.item.isProtected ?? false,
				summary: tryResolveSummaryText(member.item as ApiDeclaredItem) ?? '',
				path: generatePath(member.item.getHierarchy(), params.version),
			};
		}),
	});
}
