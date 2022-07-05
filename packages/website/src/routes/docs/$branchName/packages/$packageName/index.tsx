import { json } from '@remix-run/node';
import { Params, useLoaderData } from '@remix-run/react';
import { createApiModel } from '~/util/api-model.server';
import { findPackage, getMembers } from '~/util/parse.server';

export async function loader({ params }: { params: Params }) {
	const res = await fetch(
		`https://raw.githubusercontent.com/discordjs/docs/main/${params.packageName!}/${params.branchName!}.api.json`,
	);
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const data = await res.json();
	const model = createApiModel(data);

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
