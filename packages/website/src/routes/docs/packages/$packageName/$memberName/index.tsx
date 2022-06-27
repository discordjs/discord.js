import { json } from '@remix-run/node';
import { Params, useLoaderData } from '@remix-run/react';
import { findMember } from '../../../../../model.server';

export function loader({ params }: { params: Params }) {
	const { packageName, memberName } = params;
	return json(findMember(packageName!, memberName!));
}

export default function Member() {
	const data = useLoaderData<ReturnType<typeof findMember>>();

	console.log(data);
	return (
		<div>
			<h1>{data?.name}</h1>
			<h3>Code declaration:</h3>
			<code>{data?.excerpt}</code>
			<h3>Summary</h3>
			<p>{data?.summary}</p>
			<h3>Members</h3>
			<ul>
				{data?.members.map((member, i) => (
					<li key={i}>
						<code>{member}</code>
					</li>
				))}
			</ul>
			<h3>{'Extracted references (can be hyperlinked in code declaration in the future)'}</h3>
			<ul>
				{data?.refs.map((item, i) => (
					<li key={i}>
						<code>
							<a href={item.path}>{item.name}</a>
						</code>
					</li>
				))}
			</ul>
		</div>
	);
}
