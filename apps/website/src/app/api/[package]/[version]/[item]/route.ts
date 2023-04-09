import { generatePath } from '@discordjs/api-extractor-utils';
import { tryResolveSummaryText } from '@discordjs/scripts';
import type { ApiDeclaredItem, ApiItemContainerMixin } from '@microsoft/api-extractor-model';
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

	return NextResponse.json({
		name: member.displayName,
		kind: member.kind,
		summary: tryResolveSummaryText(member as ApiDeclaredItem) ?? '',
		path: generatePath(member.getHierarchy(), params.version),
		members: resolveMembers(member as ApiItemContainerMixin, memberPredicate).map((member) => ({
			name: member.item.displayName,
			kind: member.item.kind,
			summary: tryResolveSummaryText(member.item as ApiDeclaredItem) ?? '',
			path: generatePath(member.item.getHierarchy(), params.version),
		})),
	});
}
