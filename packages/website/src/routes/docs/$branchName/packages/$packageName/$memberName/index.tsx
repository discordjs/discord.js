/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { json } from '@remix-run/node';
import { Params, useLoaderData } from '@remix-run/react';
import { VscSymbolClass, VscSymbolMethod, VscSymbolEnum, VscSymbolInterface, VscSymbolVariable } from 'react-icons/vsc';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { ApiItem, ApiModel, ApiPackage } from '~/api-extractor.server';
import { ParameterTable } from '~/components/ParameterTable';
import { findMember } from '~/model.server';
import { TSDocConfiguration } from '~/tsdoc.server';
import { constructHyperlinkedText } from '~/util/util';

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

	return json(findMember(model, params.packageName!, params.memberName!));
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

	console.log(data?.foo);

	console.log(data?.parameters);

	console.log(data?.members);
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
			<p>{data?.summary ?? 'No summary provided.'}</p>
			{(data?.members.length ?? 0) > 0 && (
				<>
					<h3>Members</h3>
					<ul>
						{data?.members.map((member, i) => (
							<li key={i}>
								<code>{constructHyperlinkedText(member.tokens)}</code>
								<h4>Sumary</h4>
								<p>{member.summary ?? 'No summary provided.'}</p>
							</li>
						))}
					</ul>
				</>
			)}

			{(data?.parameters.length ?? 0) > 0 && (
				<>
					<h3>Parameters</h3>
					<ParameterTable data={data?.parameters ?? []} />
				</>
			)}

			{(data?.refs.length ?? 0) > 0 && (
				<>
					<h3>{'Type References'}</h3>
					<ul>
						{data?.refs.map((item, i) => (
							<li key={i}>
								<code>
									<a href={item.path}>{item.name}</a>
								</code>
							</li>
						))}
					</ul>
				</>
			)}
		</div>
	);
}
