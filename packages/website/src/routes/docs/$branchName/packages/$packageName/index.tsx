/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { json } from '@remix-run/node';
import { Params, useLoaderData } from '@remix-run/react';
import { ApiItem, ApiModel, ApiPackage } from '~/api-extractor.server';
import { TSDocConfiguration } from '~/tsdoc.server';
import { findPackage, getMembers } from '~/util/parse.server';

export async function loader({ params }: { params: Params }) {
	const res = await fetch(
		`https://raw.githubusercontent.com/discordjs/docs/main/${params.packageName!}/${params.branchName!}.api.json`,
	);
	const data = await res.json();

	const model = new ApiModel();
	// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
	const apiPackage = ApiItem.deserialize(data, {
		apiJsonFilename: '',
		toolPackage: data.metadata.toolPackage,
		toolVersion: data.metadata.toolVersion,
		versionToDeserialize: data.metadata.schemaVersion,
		tsdocConfiguration: new TSDocConfiguration(),
	}) as ApiPackage;
	model.addMember(apiPackage);

	const pkg = findPackage(model, params.packageName!);
	return json({
		members: getMembers(pkg!),
	});
}

interface LoaderData {
	members: ReturnType<typeof getMembers>;
}

export default function Package() {
	const data = useLoaderData<LoaderData>();

	return (
		<ul>
			{data.members.map((member, i) => (
				<li key={i}>
					<a href={member.path}>{member.name}</a>
				</li>
			))}
		</ul>
	);
}
