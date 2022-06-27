import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { findPackage, getMembers } from '../../../../model.server';

interface PathParams {
	params: {
		packageName: string;
	};
}

export function loader({ params }: PathParams) {
	const pkg = findPackage(params.packageName);
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
