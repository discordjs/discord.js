import { createApiModel, tryResolveSummaryText } from '@discordjs/scripts';
import type {
	ApiDeclaredItem,
	ApiEnum,
	ApiItem,
	ApiItemContainerMixin,
	ApiMethod,
	ApiMethodSignature,
	ApiProperty,
	ApiPropertySignature,
} from '@microsoft/api-extractor-model';
import { ApiItemKind } from '@microsoft/api-extractor-model';
import type { ItemRouteParams } from './page';
import { fetchModelJSON } from '~/app/docAPI';
import { OVERLOAD_SEPARATOR } from '~/util/constants';
import { findMember } from '~/util/model.server';

async function fetchMember({ package: packageName, version, item }: ItemRouteParams): Promise<ApiItem | undefined> {
	const modelJSON = await fetchModelJSON(packageName, version);
	const model = createApiModel(modelJSON);
	const pkg = model.tryGetPackageByName(packageName);
	const entry = pkg?.entryPoints[0];

	if (!entry) {
		return undefined;
	}

	const [memberName] = decodeURIComponent(item).split(OVERLOAD_SEPARATOR);

	return findMember(model, packageName, memberName);
}

function resolveMemberSearchParams(packageName: string, member: ApiItem): URLSearchParams {
	const params = new URLSearchParams({
		pkg: packageName,
		kind: member?.kind,
		name: member?.displayName,
	});

	switch (member?.kind) {
		case ApiItemKind.Interface:
		case ApiItemKind.Class: {
			const typedMember = member as ApiItemContainerMixin;

			const properties = typedMember.members.filter((member) =>
				[ApiItemKind.Property, ApiItemKind.PropertySignature].includes(member.kind),
			) as (ApiProperty | ApiPropertySignature)[];
			const methods = typedMember.members.filter((member) =>
				[ApiItemKind.Method, ApiItemKind.Method].includes(member.kind),
			) as (ApiMethod | ApiMethodSignature)[];

			params.append('methods', methods.length.toString());
			params.append('props', properties.length.toString());
			break;
		}

		case ApiItemKind.Enum: {
			const typedMember = member as ApiEnum;
			params.append('members', typedMember.members.length.toString());
			break;
		}

		default:
			break;
	}

	return params;
}

export default async function Head({ params }: { params: ItemRouteParams }) {
	const member = (await fetchMember(params))!;
	const name = `discord.js${member?.displayName ? ` | ${member.displayName}` : ''}`;
	const ogTitle = `${params.package ?? 'discord.js'}${member?.displayName ? ` | ${member.displayName}` : ''}`;
	const searchParams = resolveMemberSearchParams(params.package, member);
	const url = new URL('https://discordjs.dev/api/og_model');
	url.search = searchParams.toString();
	const ogImage = url.toString();
	const description = tryResolveSummaryText(member as ApiDeclaredItem);

	return (
		<>
			<title key="title">{name}</title>
			<meta content={description ?? ''} key="description" name="description" />
			<meta content={ogTitle} key="og_title" property="og:title" />
			<meta content={description ?? ''} key="og_description" property="og:description" />
			<meta content={ogImage} key="og_image" property="og:image" />
		</>
	);
}
