import { json } from '@remix-run/node';
import { Params, useLoaderData } from '@remix-run/react';
import { VscSymbolClass, VscSymbolMethod, VscSymbolEnum, VscSymbolInterface, VscSymbolVariable } from 'react-icons/vsc';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { findMember } from '../../../../../model.server';

export function loader({ params }: { params: Params }) {
	const { packageName, memberName } = params;
	return json(findMember(packageName!, memberName!));
}

const symbolClass = 'mr-2';
const icons = {
	Class: <VscSymbolClass color="blue" className={symbolClass} />,
	Method: <VscSymbolMethod className={symbolClass} />,
	Function: <VscSymbolMethod color="purple" className={symbolClass} />,
	Enum: <VscSymbolEnum className={symbolClass} />,
	Interface: <VscSymbolInterface color="blue" className={symbolClass} />,
	TypeAlias: <VscSymbolVariable color="blue" className={symbolClass} />,
};

export default function Member() {
	const data = useLoaderData<ReturnType<typeof findMember>>();

	console.log(data?.kind);
	return (
		<div className="px-10">
			<h1 style={{ fontFamily: 'JetBrains Mono' }} className="flex items-csenter content-center">
				{icons[data?.kind ?? 'Class']}
				{data?.name}
			</h1>
			<h3>Code declaration:</h3>
			<SyntaxHighlighter language="typescript" style={vs} codeTagProps={{ style: { fontFamily: 'JetBrains Mono' } }}>
				{data?.excerpt ?? ''}
			</SyntaxHighlighter>
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
			<h3>Parameters</h3>
			<ul>
				{data?.parameters.map((member, i) => (
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
